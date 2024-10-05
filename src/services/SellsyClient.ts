import Sellsy from "node-sellsy";
import {
  ExportInformations
} from "../interfaces/export.interface";
import {
  DocumentResult,
  DocumentsOutput,
  PeriodDates,
} from "../interfaces/sellsy.interface";
import { DocType } from "../interfaces/enum";

class SellsyClient {
  private sellsy: typeof Sellsy;

  constructor() {
    this.sellsy = new Sellsy({
      creds: {
        consumerKey: import.meta.env.VITE_CONSUMER_KEY,
        consumerSecret: import.meta.env.VITE_CONSUMER_SECRET,
        userToken: import.meta.env.VITE_USER_TOKEN,
        userSecret: import.meta.env.VITE_USER_SECRET,
      },
    });
  }

  async getDocumentsInfos({
    docType,
    periodStartDate,
    periodEndDate,
  }: ExportInformations): Promise<any> {
    const { infos } = await this.getDocuments(docType, 1, 1, {
      start: periodStartDate,
      end: periodEndDate,
    });
    return infos;
  }

  async getDocuments(
    docType: DocType,
    pagenum: number = 1,
    nbperpage: number = 1,
    periodDates: PeriodDates
  ): Promise<DocumentsOutput> {
    const convertedDates = {
      start: periodDates.start.getTime() / 1000,
      end: periodDates.end.getTime() / 1000,
    };

    const result: DocumentResult = await this.sellsy.api({
      method: "Document.getList",
      params: {
        doctype: docType,
        pagination: {
          nbperpage: nbperpage,
          pagenum: pagenum,
        },
        search: {
          periodecreationDate_start: convertedDates.start,
          periodecreationDate_end: convertedDates.end,
        },
      },
    });

    return {
      infos: result.response.infos,
      documents: result.response.result,
      status: result.response.status,
    };
  }

  async getDocument(type: string, id: string): Promise<any> {
    try {
      const document = await this.sellsy.documents.getById(type, id);
      return document;
    } catch (error) {
      console.error("Error retrieving document:", error);
      throw new Error();
    }
  }
}

export default SellsyClient;
