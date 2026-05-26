import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../../models/custumer.model';

const STORAGE_KEY = 'customers';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers$ = new BehaviorSubject<Customer[]>(this.loadFromStorage());

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
  }

  update(id: string, data: Omit<Customer, 'id' | 'createdAt'>): void {
    const updated = this.customers$.getValue().map(c =>
      c.id === id ? { ...c, ...data } : c
    );

    this.updateList(updated);
  }

  delete(id: string): void {
    const filtered = this.customers$.getValue().filter(c => c.id !== id);
    this.updateList(filtered);
  }

  // ─── Storage ─────────────────────────────────────────────

  private updateList(customers: Customer[]): void {
    this.customers$.next(customers);
    this.saveToStorage(customers);
  }

  private saveToStorage(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }

  private loadFromStorage(): Customer[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as Customer[];
    } catch {
      return [];
    }
  }
}