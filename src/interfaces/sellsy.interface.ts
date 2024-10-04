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
