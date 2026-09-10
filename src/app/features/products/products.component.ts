import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/products/product.service';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  readonly query = signal('');
  readonly category = signal('Todos');
  readonly categories = ['Todos', 'Hogar', 'Accesorios', 'Bienestar'];
  readonly products = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.productService.products().filter((product) =>
      (this.category() === 'Todos' || product.category === this.category()) && (!query || product.name.toLowerCase().includes(query))
    );
  });
}
