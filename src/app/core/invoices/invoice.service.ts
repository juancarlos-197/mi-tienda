import { Injectable, computed, signal } from '@angular/core';
import { Invoice, InvoiceDraft } from '../../shared/models/invoice.model';

const initialInvoices: Invoice[] = [
  {
    id: 'inv-1001', number: 'FAC-2026-001', customer: 'Clara Baeza', email: 'clara@example.com', issueDate: '2026-09-02', dueDate: '2026-09-16', status: 'Pendiente',
    lines: [{ product: 'Lámpara Nube', quantity: 1, unitPrice: 86 }], notes: 'Entrega en horario de mañana.'
  },
  {
    id: 'inv-1002', number: 'FAC-2026-002', customer: 'Nora Vidal', email: 'nora@example.com', issueDate: '2026-08-28', dueDate: '2026-09-11', status: 'Pagada',
    lines: [{ product: 'Jarrón Alba', quantity: 2, unitPrice: 42.5 }], notes: ''
  },
  {
    id: 'inv-1003', number: 'FAC-2026-003', customer: 'Estudio Lumen', email: 'hola@lumen.example', issueDate: '2026-08-20', dueDate: '2026-09-03', status: 'Anulada',
    lines: [{ product: 'Set de lino', quantity: 3, unitPrice: 28 }], notes: 'Pedido cancelado por el cliente.'
  }
];

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly invoicesState = signal<Invoice[]>(initialInvoices);
  readonly invoices = this.invoicesState.asReadonly();
  readonly total = computed(() => this.invoices().reduce((sum, invoice) => sum + this.getTotal(invoice), 0));

  create(draft: InvoiceDraft): Invoice {
    const invoice: Invoice = { ...draft, id: crypto.randomUUID(), number: this.nextNumber() };
    this.invoicesState.update((invoices) => [invoice, ...invoices]);
    return invoice;
  }

  update(id: string, draft: InvoiceDraft): void {
    this.invoicesState.update((invoices) => invoices.map((invoice) => invoice.id === id ? { ...draft, id, number: invoice.number } : invoice));
  }

  remove(id: string): void {
    this.invoicesState.update((invoices) => invoices.filter((invoice) => invoice.id !== id));
  }

  getTotal(invoice: Invoice): number {
    return invoice.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  }

  private nextNumber(): string {
    const year = new Date().getFullYear();
    const next = this.invoices().length + 1;
    return `FAC-${year}-${String(next).padStart(3, '0')}`;
  }
}