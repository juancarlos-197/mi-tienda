import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { Invoice, InvoiceStatus } from '../../shared/models/invoice.model';
import { InvoiceService } from '../../core/invoices/invoice.service';
import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-invoices',
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatSelectModule, MatSortModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesComponent {
  readonly invoiceService = inject(InvoiceService);
  private readonly dialog = inject(MatDialog);
  readonly query = signal('');
  readonly status = signal<'Todos' | InvoiceStatus>('Todos');
  readonly sort = signal<'issueDate' | 'customer' | 'total'>('issueDate');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(8);
  readonly statuses: Array<'Todos' | InvoiceStatus> = ['Todos', 'Pendiente', 'Pagada', 'Anulada'];
  readonly filteredInvoices = computed(() => {
    const query = this.query().trim().toLowerCase();
    const status = this.status();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;
    return [...this.invoiceService.invoices().filter((invoice) =>
      (!query || `${invoice.number} ${invoice.customer} ${invoice.email}`.toLowerCase().includes(query)) &&
      (status === 'Todos' || invoice.status === status)
    )].sort((left, right) => {
      const leftValue = this.sort() === 'total' ? this.invoiceService.getTotal(left) : this.sort() === 'customer' ? left.customer : left.issueDate;
      const rightValue = this.sort() === 'total' ? this.invoiceService.getTotal(right) : this.sort() === 'customer' ? right.customer : right.issueDate;
      return String(leftValue).localeCompare(String(rightValue), 'es', { numeric: true }) * direction;
    });
  });
  readonly visibleInvoices = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredInvoices().slice(start, start + this.pageSize());
  });

  openCreate(): void { this.dialog.open(InvoiceDialogComponent, { width: '720px', maxWidth: '95vw' }).afterClosed().subscribe((draft) => { if (draft) this.invoiceService.create(draft); }); }
  openEdit(invoice: Invoice): void { this.dialog.open(InvoiceDialogComponent, { data: invoice, width: '720px', maxWidth: '95vw' }).afterClosed().subscribe((draft) => { if (draft) this.invoiceService.update(invoice.id, draft); }); }
  delete(invoice: Invoice): void { if (window.confirm(`¿Eliminar la factura ${invoice.number}?`)) this.invoiceService.remove(invoice.id); }
  updatePage(event: PageEvent): void { this.pageIndex.set(event.pageIndex); this.pageSize.set(event.pageSize); }
  updateQuery(value: string): void { this.query.set(value); this.pageIndex.set(0); }
  updateStatus(value: 'Todos' | InvoiceStatus): void { this.status.set(value); this.pageIndex.set(0); }
  updateSort(value: 'issueDate' | 'customer' | 'total'): void { this.sort.set(value); this.pageIndex.set(0); }
  toggleDirection(): void { this.sortDirection.update((direction) => direction === 'asc' ? 'desc' : 'asc'); }
  total(invoice: Invoice): number { return this.invoiceService.getTotal(invoice); }
}