import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Invoice, InvoiceDraft } from '../../../shared/models/invoice.model';

@Component({
  selector: 'app-invoice-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './invoice-dialog.component.html',
  styleUrl: './invoice-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDialogComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<InvoiceDialogComponent, InvoiceDraft | undefined>);
  readonly data = inject<Invoice | null>(MAT_DIALOG_DATA);
  readonly form = this.formBuilder.group({
    customer: [this.data?.customer ?? '', [Validators.required, Validators.maxLength(80)]],
    email: [this.data?.email ?? '', [Validators.required, Validators.email]],
    issueDate: [this.toDate(this.data?.issueDate), Validators.required],
    dueDate: [this.toDate(this.data?.dueDate), Validators.required],
    status: [this.data?.status ?? 'Pendiente', Validators.required],
    notes: [this.data?.notes ?? '', Validators.maxLength(240)],
    lines: this.formBuilder.array(this.data?.lines?.map((line) => this.createLine(line.product, line.quantity, line.unitPrice)) ?? [this.createLine()])
  });

  get lines(): FormArray { return this.form.controls.lines; }
  addLine(): void { this.lines.push(this.createLine()); }
  removeLine(index: number): void { if (this.lines.length > 1) this.lines.removeAt(index); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const draft: InvoiceDraft = {
      customer: value.customer ?? '',
      email: value.email ?? '',
      issueDate: this.toIso(value.issueDate),
      dueDate: this.toIso(value.dueDate),
      status: value.status ?? 'Pendiente',
      notes: value.notes ?? '',
      lines: value.lines.map((line) => ({ product: line.product ?? '', quantity: Number(line.quantity), unitPrice: Number(line.unitPrice) }))
    };
    this.dialogRef.close(draft);
  }

  cancel(): void { this.dialogRef.close(); }
  private createLine(product = '', quantity = 1, unitPrice = 0) {
    return this.formBuilder.group({ product: [product, Validators.required], quantity: [quantity, [Validators.required, Validators.min(1)]], unitPrice: [unitPrice, [Validators.required, Validators.min(0)]] });
  }
  private toDate(value?: string): Date | null { return value ? new Date(`${value}T00:00:00`) : new Date(); }
  private toIso(value: Date | null): string { return value ? value.toISOString().slice(0, 10) : ''; }
}