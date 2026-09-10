import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feature-placeholder',
  imports: [RouterLink],
  template: `<main class="placeholder"><a routerLink="/products" class="brand">mi tienda</a><p class="eyebrow">Área de trabajo</p><h1>{{ title }}</h1><p>Esta feature ya tiene su ruta lazy preparada. Aquí construiremos el flujo completo en la siguiente etapa.</p><a routerLink="/products">Volver al catálogo</a></main>`,
  styles: [`.placeholder { box-sizing: border-box; min-height: 100vh; padding: 12vh 10vw; color: #25332d; background: #f4f5ef; }.brand { color: inherit; font-weight: 700; text-decoration: none; }.eyebrow { margin-top: 18vh; color: #d7835a; font-size: .7rem; letter-spacing: .14em; text-transform: uppercase; }h1 { margin: 12px 0; font: 400 clamp(3rem, 7vw, 7rem)/.9 Georgia, serif; letter-spacing: -.06em; }.placeholder p { max-width: 420px; color: #6f766e; line-height: 1.7; }.placeholder a:last-child { display: inline-block; margin-top: 24px; color: #25332d; }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = this.route.snapshot.data['title'] as string;
}
