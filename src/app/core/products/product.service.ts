import { Injectable, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productState = signal<Product[]>([
    { id: 'p-1', name: 'Jarrón Forma N.º 2', category: 'Hogar', price: 38, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85' },
    { id: 'p-2', name: 'Bolso Nube de Lino', category: 'Accesorios', price: 64, stock: 8, imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85' },
    { id: 'p-3', name: 'Vela Sándalo & Higo', category: 'Bienestar', price: 24, stock: 21, imageUrl: 'https://images.unsplash.com/photo-1602874801006-e26d5a2d8b7d?auto=format&fit=crop&w=900&q=85' },
    { id: 'p-4', name: 'Taza Ritual Matinal', category: 'Hogar', price: 21, stock: 16, imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85' }
  ]);

  readonly products = this.productState.asReadonly();
}
