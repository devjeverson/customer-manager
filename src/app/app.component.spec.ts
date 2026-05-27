import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.resetTestingModule());

  // ─── Criação ──────────────────────────────────────────────

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  // ─── Template ─────────────────────────────────────────────

  it('deve renderizar o header', () => {
    const header = fixture.nativeElement.querySelector('.app-header');
    expect(header).toBeTruthy();
  });

  it('deve renderizar a brand com texto "Customer"', () => {
    const brand = fixture.nativeElement.querySelector('.brand');
    expect(brand.textContent).toContain('Customer');
  });

  it('deve renderizar a brand com texto "Manager"', () => {
    const brand = fixture.nativeElement.querySelector('.brand');
    expect(brand.textContent).toContain('Manager');
  });

  it('deve renderizar o link de navegação "Clientes"', () => {
    const nav = fixture.nativeElement.querySelector('.header-nav');
    expect(nav.textContent).toContain('Clientes');
  });

  it('deve renderizar o router-outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  // ─── Link da brand ────────────────────────────────────────

  it('brand deve ter routerLink para /', () => {
    const brand = fixture.nativeElement.querySelector('.brand');
    expect(brand.getAttribute('href')).toBe('/');
  });

  it('link Clientes deve ter routerLink para /', () => {
    const link = fixture.nativeElement.querySelector('.header-nav a');
    expect(link.getAttribute('href')).toBe('/');
  });

});