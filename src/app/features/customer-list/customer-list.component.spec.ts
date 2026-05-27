import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';

import { CustomerListComponent } from './customer-list.component';
import { CustomerService } from '../../core/services/custumer.service';
import { Customer } from '../../models/custumer.model';

const makeCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  id: 'id-1',
  name: 'João Silva',
  email: 'joao@email.com',
  document: '52998224725',
  status: 'active',
  createdAt: new Date(),
  ...overrides
});

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let serviceSpy: jasmine.SpyObj<CustomerService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let customers$: Subject<Customer[]>;

  beforeEach(async () => {
    customers$ = new Subject<Customer[]>();

    serviceSpy = jasmine.createSpyObj('CustomerService', ['getAll', 'delete']);
    serviceSpy.getAll.and.returnValue(customers$.asObservable());

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CustomerListComponent],
      providers: [
        provideRouter([]),
        { provide: CustomerService, useValue: serviceSpy },
      ]
    }).compileComponents();

    TestBed.overrideProvider(MatDialog, { useValue: dialogSpy });

    fixture   = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // emite lista inicial
    customers$.next([makeCustomer(), makeCustomer({ id: 'id-2', name: 'Maria', email: 'maria@email.com' })]);
    fixture.detectChanges();
  });

  afterEach(() => TestBed.resetTestingModule());

  // ─── Criação ──────────────────────────────────────────────

  describe('instância', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar com searchControl vazio', () => {
      expect(component.searchControl.value).toBe('');
    });

    it('deve definir as colunas da tabela corretamente', () => {
      expect(component.displayedColumns).toEqual(['name', 'email', 'document', 'status', 'actions']);
    });
  });

  // ─── Filtro ───────────────────────────────────────────────

  describe('filtro', () => {
    it('retorna todos os clientes com filtro vazio', () => {
      expect(component.customers().length).toBe(2);
    });

    it('filtra por nome (case insensitive)', fakeAsync(() => {
      component.searchControl.setValue('maria');
      tick(300);
      fixture.detectChanges();
      expect(component.customers().length).toBe(1);
      expect(component.customers()[0].name).toBe('Maria');
    }));

    it('filtra por email', fakeAsync(() => {
      component.searchControl.setValue('maria@email.com');
      tick(300);
      fixture.detectChanges();
      expect(component.customers().length).toBe(1);
    }));

    it('retorna vazio se nenhum cliente bate com o filtro', fakeAsync(() => {
      component.searchControl.setValue('xpto-inexistente');
      tick(300);
      fixture.detectChanges();
      expect(component.customers().length).toBe(0);
    }));

    it('retorna todos ao limpar o filtro', fakeAsync(() => {
      component.searchControl.setValue('maria');
      tick(300);
      component.searchControl.setValue('');
      tick(300);
      fixture.detectChanges();
      expect(component.customers().length).toBe(2);
    }));
  });

  // ─── formatDocument ───────────────────────────────────────

  describe('formatDocument()', () => {
    it('formata CPF corretamente', () => {
      expect(component.formatDocument('52998224725')).toBe('529.982.247-25');
    });

    it('formata CNPJ corretamente', () => {
      expect(component.formatDocument('11222333000181')).toBe('11.222.333/0001-81');
    });

    it('retorna valor original se não for CPF nem CNPJ', () => {
      expect(component.formatDocument('123')).toBe('123');
    });

    it('formata CPF que já vem com máscara', () => {
      expect(component.formatDocument('529.982.247-25')).toBe('529.982.247-25');
    });
  });

  // ─── delete ───────────────────────────────────────────────

  describe('delete()', () => {
    it('abre o dialog de confirmação', () => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as any);
      component.delete(makeCustomer());
      expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('passa o nome do cliente na mensagem do dialog', () => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as any);
      const customer = makeCustomer({ name: 'Carlos' });
      component.delete(customer);

      const dialogData = dialogSpy.open.calls.mostRecent().args[1]?.data as { message: string };
      expect(dialogData.message).toContain('Carlos');
    });

    it('chama service.delete quando confirmado', () => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);
      component.delete(makeCustomer({ id: 'id-1' }));
      expect(serviceSpy.delete).toHaveBeenCalledWith('id-1');
    });

    it('não chama service.delete quando cancelado', () => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as any);
      component.delete(makeCustomer());
      expect(serviceSpy.delete).not.toHaveBeenCalled();
    });

    it('não chama service.delete quando dialog fecha sem resposta', () => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
      component.delete(makeCustomer());
      expect(serviceSpy.delete).not.toHaveBeenCalled();
    });
  });

});