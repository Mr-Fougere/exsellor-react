import Sellsy from 'node-sellsy';
import { DocType, ExportInputs } from '../interfaces/export.interface';

interface DocumentResult {
  status: string;
  response: {
    infos: any; // Remplacez `any` par le type approprié pour les infos
    result: any; // Remplacez `any` par le type approprié pour les documents
  };
}

interface PeriodDates {
  start: Date;
  end: Date;
}

class SellsyClient {
  private sellsy: Sellsy;

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

  async getDocumentsInfos({docType, periodStartDate, periodEndDate}: ExportInputs): Promise<any> {
    const { infos } = await this.getDocuments(docType, 1, 1, { start: periodStartDate, end: periodEndDate });
    return infos;
  }
  
  async getDocuments(docType: DocType, pagenum: number = 1, nbperpage: number = 1, periodDates: PeriodDates): Promise<{ infos: any; documents: any }> { 
    const convertedDates = {
      start: periodDates.start.getTime() / 1000,
      end: periodDates.start.getTime() / 1000,
    };

    const result: DocumentResult = await this.sellsy.api({
      method: 'Document.getList',
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

    if (result.status !== 'success') {
      throw new Error(result.response.error);
    }

    return { infos: result.response.infos, documents: result.response.result };
  }

  async getDocument(type: string, id: string): Promise<any> { 
    try {
      const document = await this.sellsy.documents.getById(type, id);
      return document;
    } catch (error) {
      console.error('Error retrieving document:', error);
      throw new Error(error);
    }
  }
}

export default SellsyClient;
