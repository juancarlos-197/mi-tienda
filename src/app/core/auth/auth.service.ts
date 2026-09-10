import { computed, Injectable, signal } from '@angular/core';

export interface SessionUser {
  email: string;
  role: 'admin' | 'customer';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<SessionUser | null>(this.readSession());
  readonly currentUser = this.session.asReadonly();
  readonly isAuthenticated = computed(() => this.session() !== null);

  login(email: string, password: string): boolean {
    if (email.trim().length < 3 || password.length < 6) {
      return false;
    }

    const user: SessionUser = {
      email: email.trim().toLowerCase(),
      role: email.toLowerCase().includes('admin') ? 'admin' : 'customer'
    };
    this.session.set(user);
    localStorage.setItem('mi-tienda-session', JSON.stringify(user));
    return true;
  }

  logout(): void {
    this.session.set(null);
    localStorage.removeItem('mi-tienda-session');
  }

  private readSession(): SessionUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const stored = localStorage.getItem('mi-tienda-session');
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored) as SessionUser;
    } catch {
      localStorage.removeItem('mi-tienda-session');
      return null;
    }
  }
}
