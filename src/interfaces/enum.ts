export enum DocumentType {
  Invoice = "invoice",
  Delivery = "delivery",
  CreditNote = "creditnote",
  Order = "order",
}

export enum DocumentFontAwesomeIcon {
  Invoice = "fa-file",
  Delivery = "fa-truck",
  CreditNote = "fa-dollar-sign",
  Order = "fa-box",
}

export enum Month {
  January = "january",
  February = "february",
  March = "march",
  April = "april",
  May = "may",
  June = "june",
  July = "july",
  August = "august",
  September = "september",
  October = "october",
  November = "november",
  December = "december",
}

export enum InvoiceStep {
  Draft = "draft",
  Due = "due",
  Paid = "paid",
  PayInProgress = "payinprogress",
  Cancelled = "cancelled",
  Late = "late",
}

export enum CreditNoteStep {
  Draft = "draft",
  Stored = "stored",
  PartialSpend = "partialspend",
  Spent = "spent",
  Cancelled = "cancelled"
}

export enum OrderStep {
  Draft = "draft",
  Sent = "sent",
  Read = "read",
  Accepted = "accepted",
  Expired = "expired",
  Advanced  = "advanced",
  PartialInvoiced   = "partialinvoiced",
  Invoiced  = "invoiced",
  Cancelled = "cancelled"
}

export enum DeliveryStep {
  Draft = "draft",
  Sent = "sent",
  Read = "read",
  PartialInvoiced = "partialinvoiced",
  Invoiced = "invoiced",
}

export enum DraftStep {
  Draft = "draft",
}