import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'products' },
	{
		path: 'auth/login',
		loadComponent: () => import('./features/auth/login/login.component').then((module) => module.LoginComponent)
	},
	{
		path: 'products',
		loadComponent: () => import('./features/products/products.component').then((module) => module.ProductsComponent)
	},
	...['dashboard', 'categories', 'users', 'orders'].map((path) => ({
		path,
		canActivate: [authGuard],
		data: { title: path[0].toUpperCase() + path.slice(1) },
		loadComponent: () => import('./shared/components/feature-placeholder/feature-placeholder.component').then((module) => module.FeaturePlaceholderComponent)
	})),
	{ path: '**', redirectTo: 'products' }
];
