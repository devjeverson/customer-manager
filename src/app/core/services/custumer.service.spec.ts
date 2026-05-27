import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from './custumer.service';
import { Customer } from '../../models/custumer.model';
import { take } from 'rxjs/operators';

const makePayload = (overrides = {}) => ({
  name: 'João Silva',
  email: 'joao@email.com',
  document: '52998224725',
  status: 'active' as const,
  ...overrides
});

describe('CustomerService', () => {
  let service: CustomerService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const setup = () => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [
        CustomerService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });
    service = TestBed.inject(CustomerService);
  };

  beforeEach(() => {
    localStorage.clear();
    setup();
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  // ─── Criação do service ───────────────────────────────────

  describe('instância', () => {
    it('deve ser criado', () => {
      expect(service).toBeTruthy();
    });

    it('inicia com lista vazia quando localStorage está vazio', (done) => {
      service.getAll().subscribe(list => {
        expect(list).toEqual([]);
        done();
      });
    });

    it('carrega dados existentes do localStorage ao iniciar', () => {
      const mock: Customer[] = [{
        id: 'abc',
        name: 'Salvo',
        email: 's@s.com',
        document: '52998224725',
        status: 'active',
        createdAt: new Date()
      }];
      localStorage.setItem('customers', JSON.stringify(mock));

      TestBed.resetTestingModule();
      setup();

      service.getAll().subscribe(list => {
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Salvo');
      });
    });

    it('retorna lista vazia se localStorage tiver JSON inválido', () => {
      localStorage.setItem('customers', 'INVALID_JSON');

      TestBed.resetTestingModule();
      setup();

      service.getAll().subscribe(list => {
        expect(list).toEqual([]);
      });
    });
  });

  // ─── getAll ───────────────────────────────────────────────

  describe('getAll()', () => {
    it('retorna Observable', () => {
      expect(typeof service.getAll().subscribe).toBe('function');
    });

    it('emite lista atualizada reativamente após create', (done) => {
      const emissions: Customer[][] = [];

      service.getAll().subscribe(list => {
        emissions.push(list);
        if (emissions.length === 2) {
          expect(emissions[0].length).toBe(0);
          expect(emissions[1].length).toBe(1);
          done();
        }
      });

      service.create(makePayload());
    });
  });

  // ─── getById ──────────────────────────────────────────────

  describe('getById()', () => {
    it('retorna o cliente correto pelo id', () => {
      service.create(makePayload({ name: 'Alvo' }));

      let id: string;
      service.getAll().pipe(take(1)).subscribe(list => id = list[0].id);

      const found = service.getById(id!);
      expect(found?.name).toBe('Alvo');
    });

    it('retorna undefined para id inexistente', () => {
      expect(service.getById('nao-existe')).toBeUndefined();
    });

    it('retorna undefined em lista vazia', () => {
      expect(service.getById('qualquer')).toBeUndefined();
    });
  });

  // ─── create ───────────────────────────────────────────────

  describe('create()', () => {
    it('adiciona cliente à lista', (done) => {
      service.create(makePayload());
      service.getAll().subscribe(list => {
        expect(list.length).toBe(1);
        done();
      });
    });

    it('gera id único para cada cliente', (done) => {
      service.create(makePayload({ name: 'A' }));
      service.create(makePayload({ name: 'B' }));
      service.getAll().subscribe(list => {
        expect(list[0].id).not.toBe(list[1].id);
        done();
      });
    });

    it('define createdAt automaticamente', (done) => {
      service.create(makePayload());
      service.getAll().subscribe(list => {
        expect(list[0].createdAt).toBeDefined();
        done();
      });
    });

    it('persiste no localStorage', () => {
      service.create(makePayload({ name: 'Persistido' }));
      const raw = JSON.parse(localStorage.getItem('customers')!);
      expect(raw[0].name).toBe('Persistido');
    });

    it('acumula múltiplos clientes', (done) => {
      service.create(makePayload({ name: 'A' }));
      service.create(makePayload({ name: 'B' }));
      service.create(makePayload({ name: 'C' }));
      service.getAll().subscribe(list => {
        expect(list.length).toBe(3);
        done();
      });
    });

    it('notifica snackbar com mensagem de sucesso', () => {
      service.create(makePayload());
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Cliente cadastrado com sucesso!',
        'Fechar',
        jasmine.any(Object)
      );
    });
  });

  // ─── update ───────────────────────────────────────────────

  describe('update()', () => {
    let id: string;

    beforeEach(() => {
      service.create(makePayload({ name: 'Original' }));
      service.getAll().pipe(take(1)).subscribe(list => id = list[0].id);
    });

    it('atualiza nome do cliente', (done) => {
      service.update(id, makePayload({ name: 'Atualizado' }));
      service.getAll().subscribe(list => {
        expect(list[0].name).toBe('Atualizado');
        done();
      });
    });

    it('atualiza status do cliente', (done) => {
      service.update(id, makePayload({ status: 'inactive' }));
      service.getAll().subscribe(list => {
        expect(list[0].status).toBe('inactive');
        done();
      });
    });

    it('preserva id e createdAt após update', (done) => {
      service.update(id, makePayload({ name: 'Novo Nome' }));
      service.getAll().subscribe(list => {
        expect(list[0].id).toBe(id);
        expect(list[0].createdAt).toBeDefined();
        done();
      });
    });

    it('não altera outros clientes', (done) => {
      service.create(makePayload({ name: 'Intocável' }));
      service.update(id, makePayload({ name: 'Modificado' }));
      service.getAll().subscribe(list => {
        const intocavel = list.find(c => c.name === 'Intocável');
        expect(intocavel).toBeDefined();
        done();
      });
    });

    it('persiste alteração no localStorage', () => {
      service.update(id, makePayload({ name: 'NoStorage' }));
      const raw = JSON.parse(localStorage.getItem('customers')!);
      expect(raw[0].name).toBe('NoStorage');
    });

    it('notifica snackbar com mensagem de atualização', () => {
      service.update(id, makePayload());
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Cliente atualizado com sucesso!',
        'Fechar',
        jasmine.any(Object)
      );
    });
  });

  // ─── delete ───────────────────────────────────────────────

  describe('delete()', () => {
    let id: string;

    beforeEach(() => {
      service.create(makePayload({ name: 'Deletar' }));
      service.getAll().pipe(take(1)).subscribe(list => id = list[0].id);
    });

    it('remove o cliente da lista', (done) => {
      service.delete(id);
      service.getAll().subscribe(list => {
        expect(list.length).toBe(0);
        done();
      });
    });

    it('remove apenas o cliente alvo', (done) => {
      service.create(makePayload({ name: 'Manter' }));
      service.delete(id);
      service.getAll().subscribe(list => {
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Manter');
        done();
      });
    });

    it('atualiza localStorage após exclusão', () => {
      service.delete(id);
      const raw = JSON.parse(localStorage.getItem('customers')!);
      expect(raw).toEqual([]);
    });

    it('não falha ao deletar id inexistente', () => {
      expect(() => service.delete('id-fantasma')).not.toThrow();
    });

    it('notifica snackbar com mensagem de exclusão', () => {
      service.delete(id);
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Cliente excluído.',
        'Fechar',
        jasmine.any(Object)
      );
    });
  });

});