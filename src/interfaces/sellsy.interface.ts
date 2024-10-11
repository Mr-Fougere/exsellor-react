import { CreditNoteStep, DeliveryStep, DraftStep, InvoiceStep, OrderStep } from "./enum";

export interface DocumentResult {
  status: string;
  response: {
    infos: any;
    result: any;
    status: string;
  };
}

export interface PeriodDates {
  start: Date;
  end: Date;
}

export interface DocumentsOutput {
  infos: any;
  documents: any;
  status: string;
}

export type DocumentStep = InvoiceStep | CreditNoteStep | OrderStep | DeliveryStep | DraftStep

export type DocumentSteps = DocumentStep[]