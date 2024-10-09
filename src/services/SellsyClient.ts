import Sellsy from "node-sellsy";
import { ExportInformations } from "../interfaces/export.interface";
import {
  DocumentResult,
  DocumentsOutput,
  PeriodDates,
} from "../interfaces/sellsy.interface";
import { DocType } from "../interfaces/enum";
import { CredentialInputs } from "../interfaces/credential.interface";

class SellsyClient {
  private sellsy: typeof Sellsy;

  constructor() {
    this.sellsy = null;
  }

  setup(credentials: CredentialInputs) {
    this.sellsy = new Sellsy({
      creds: credentials,
    });
  }

  get isSetup(): boolean {    
    return this.sellsy !== null;
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

  private getStoredDocTypesPeriodDates(): { [key: string]: PeriodDates } {
    const storedDocTypesPeriodDates = localStorage.getItem("docTypesPeriodDates");
    const parsedDocTypesPeriodDates: { [key: string]: {start: string, end: string} } =  storedDocTypesPeriodDates ? JSON.parse(storedDocTypesPeriodDates) : {};
    const docTypesPeriodDates: { [key: string]: PeriodDates } = {};
    for (const key in parsedDocTypesPeriodDates) {
      docTypesPeriodDates[key] = {
        start: new Date(parsedDocTypesPeriodDates[key].start),
        end: new Date(parsedDocTypesPeriodDates[key].end),
      };
    }
    return docTypesPeriodDates;
  }

  async getAllDocTypesPeriodDates(): Promise<{ [key: string]: PeriodDates }> {
    const storedDocTypesPeriodDates = this.getStoredDocTypesPeriodDates();
    if (Object.keys(storedDocTypesPeriodDates).length) {
      return storedDocTypesPeriodDates;
    }
    const docTypes = Object.keys(DocType) as DocType[];
    const docTypesPeriodDates: { [key: string]: PeriodDates } = {};

    for (const docType of docTypes) {
      const periodDates = await this.getDocTypePeriodDates(docType);
      docTypesPeriodDates[docType] = periodDates;
    }

    localStorage.setItem("docTypesPeriodDates", JSON.stringify(docTypesPeriodDates));

    return docTypesPeriodDates;
  }

  async getDocTypePeriodDates(docType: DocType): Promise<PeriodDates> {
    const { documents: firstDocuments, infos: firstDocumentsInfos } = await this.getDocuments(
      docType,
      1,
      1
    );
    const { documents: lastDocuments } = await this.getDocuments(
      docType,
      firstDocumentsInfos.nbpages,
      1
    );
    
    const firstKey = Object.keys(firstDocuments)[0];
    const firstDocumentTypeDate = new Date(firstDocuments[firstKey].created);
    const lastKey = Object.keys(lastDocuments)[0];
    const lastDocumentTypeDate = new Date(lastDocuments[lastKey].created);

    return {
      start: firstDocumentTypeDate,
      end: lastDocumentTypeDate,
    };
  }

  async getDocuments(
    docType: DocType,
    pagenum: number = 1,
    nbperpage: number = 1,
    periodDates: PeriodDates = { start: new Date(1), end: new Date() }
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
