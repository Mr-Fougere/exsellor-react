import { DocType, Document, ExportInputs, FormattedRow, SellsyAddress } from "../interfaces/export.interface";
import SellsyClient from "./sellsy";

class CSVGenerator {
    private sellsy: SellsyClient;
  
    constructor() {
      this.sellsy = new SellsyClient();
    }
  
    private findCountryAddress(address: SellsyAddress): string {
      const partsArray = Object.values(address.partsToDisplay).reverse();
  
      const result = partsArray.find((part) => part?.txt && !/\d/.test(part.txt));
  
      return result ? result.txt : "Non renseigné";
    }
  
    private roundToTwoAndConvert(num: number): string {
      if (!num) return "0";
      return num.toFixed(2).replace(".", ",");
    }
  
    private parseDocumentRows(doc: Document): FormattedRow[] {
      const orderName = doc.ident;
      const billingCountry = this.findCountryAddress(doc.thirdAddress);
      const customerName = doc.thirdName;
      const shippingCountry = this.findCountryAddress(doc.shipAddress);
      const docDate = doc.displayedDate;
      const rows = doc.map.rows;
  
      const formattedRows: FormattedRow[] = [];
  
      for (const [_rowId, row] of Object.entries(rows)) {
        if (!row.type) continue;
  
        const variantSku = row.name;
        const taxes = Number(row.taxAmount);
        const discounts = Number(row.discount);
        const shipping = row.type === "shipping" ? Number(row.totalAmount) : 0;
        const netQuantity = Number(row.qt);
        const netSales = Number(row.totalAmount);
  
        const grossSales = netSales - discounts;
        const totalSales = netSales + taxes;
  
        formattedRows.push([
          "B2B",
          docDate,
          orderName,
          billingCountry,
          customerName,
          shippingCountry,
          variantSku,
          1, // Assuming this is a constant
          this.roundToTwoAndConvert(grossSales),
          this.roundToTwoAndConvert(discounts),
          null, // No returns available
          this.roundToTwoAndConvert(netSales),
          this.roundToTwoAndConvert(shipping),
          this.roundToTwoAndConvert(taxes),
          this.roundToTwoAndConvert(totalSales),
          this.roundToTwoAndConvert(netQuantity),
        ]);
      }
  
      return formattedRows;
    }
  
    private async fetchDocumentInformations(
      page: number,
      docType: DocType,
      dates: { start: Date; end: Date }
    ): Promise<FormattedRow[]> {
      const parsedRows: FormattedRow[] = [];
  
      const { documents } = await this.sellsy.getDocuments(docType, page, 100, dates);
  
      for (const [docId, _document] of Object.entries(documents)) {
        const doc = await this.sellsy.getDocument(docType, docId);
        parsedRows.push(...this.parseDocumentRows(doc));
      }
  
      return parsedRows;
    }
  
    public async generateCSV(exportInputs: ExportInputs): Promise<void> {
      const documentRowParsed: FormattedRow[][] = [];
  
      const nbPages = Math.ceil(exportInputs.docCount || 1 / 100);
  
      for (let pageIndex = 1; pageIndex <= nbPages; pageIndex++) {
        documentRowParsed.push(
          await this.fetchDocumentInformations(pageIndex, exportInputs.docType, {
            start: exportInputs.periodStartDate,
            end: exportInputs.periodEndDate,
          })
        );
      }
  
      const rows: FormattedRow[] = [
        [
          "Shop",
          "day",
          "order_name",
          "billing_country",
          "customer_name",
          "shipping_country",
          "variant_sku",
          "orders",
          "gross_sales",
          "discounts",
          "returns",
          "net_sales",
          "shipping",
          "taxes",
          "total_sales",
          "Net Quantity",
        ],
      ];
  
      rows.push(...documentRowParsed.flat(1));
      const mappedRows = rows.map((row) => row.join(",")).join("\n");
  
      this.downloadCSV(
        mappedRows,
        `sellsy-${exportInputs.docType}.csv`
      );
    }
  
    private downloadCSV(content: string, filename: string): void {
      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
  
      chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: false,
      });
    }
  }

export default CSVGenerator;