export interface ExportInputs {
  docType: DocType;
  periodStartDate?: Date;
  periodEndDate?: Date;
  periodStartInputDate: string;
  periodEndInputDate: string;
  estimatedTime?: number; // in seconds
  exportStartDate?: Date;
  docCount?: number;
}

export enum DocType {
  invoice = "Facture",
  delivery = "Bon de livraison",
  creditnote = "Avoir",
  order = "Bon de commande",
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
