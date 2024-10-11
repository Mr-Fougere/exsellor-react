import { DocumentType } from "./enum";
import { DocumentSteps } from "./sellsy.interface";

export interface ExportInputs {
  documentType: DocumentType;
  periodStartInputDate: string;
  periodEndInputDate: string;
  steps?: DocumentSteps
}

export interface ExportInformations extends ExportInputs {
  periodStartDate: Date;
  periodEndDate: Date;
  estimatedTime?: number; // in seconds
  exportStartDate?: Date;
  documentCount?: number;
}


export interface ExportEstimation {
  docCount: number;
  estimatedTime: number;
}

export interface DocumentRow {
  name: string;
  type: string;
  taxAmount: string | number;
  discount: string | number;
  totalAmount: string | number;
  qt: string | number;
}

export interface Document {
  ident: string;
  step: string,
  thirdAddress: SellsyAddress;
  thirdName: string;
  shipAddress: SellsyAddress;
  displayedDate: string;
  map: {
    rows: Record<string, DocumentRow>;
  };
}

export type FormattedRow = (string | number | null)[];

export interface SellsyAddress {
  partsToDisplay: Record<string, { txt: string }>;
}
