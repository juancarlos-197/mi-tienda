export type InvoiceStatus = 'Pendiente' | 'Pagada' | 'Anulada';

export interface InvoiceLine {
  product: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  customer: string;
  email: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  notes: string;
}

export type InvoiceDraft = Omit<Invoice, 'id' | 'number'>;