import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from '../../models/custumer.model';

const STORAGE_KEY = 'customers';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly snackbar = inject(MatSnackBar);
  private readonly customers$ = new BehaviorSubject<Customer[]>([]);

  constructor() {
    this.customers$.next(this.loadFromStorage());
  }

  // ─── Read ────────────────────────────────────────────────

  getAll(): Observable<Customer[]> {
    return this.customers$.asObservable();
  }

  getById(id: string): Customer | undefined {
    return this.customers$.getValue().find(c => c.id === id);
  }

  // ─── Write ───────────────────────────────────────────────

  create(data: Omit<Customer, 'id' | 'createdAt'>): void {
    const newCustomer: Customer = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    this.updateList([...this.customers$.getValue(), newCustomer]);
    this.notify('Cliente cadastrado com sucesso!');
  }

  update(id: string, data: Omit<Customer, 'id' | 'createdAt'>): void {
    const updated = this.customers$.getValue().map(c =>
      c.id === id ? { ...c, ...data } : c
    );

    this.updateList(updated);
    this.notify('Cliente atualizado com sucesso!');
  }

  delete(id: string): void {
    const filtered = this.customers$.getValue().filter(c => c.id !== id);
    this.updateList(filtered);
    this.notify('Cliente excluído.');
  }

  // ─── Storage ─────────────────────────────────────────────

  private updateList(customers: Customer[]): void {
    this.customers$.next(customers);
    this.saveToStorage(customers);
  }

  private saveToStorage(customers: Customer[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }

  private loadFromStorage(): Customer[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as Customer[];
    } catch {
      return [];
    }
  }

  private notify(message: string): void {
    this.snackbar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

}