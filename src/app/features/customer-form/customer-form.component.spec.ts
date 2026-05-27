import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';

import { CustomerFormComponent } from './customer-form.component';
import { CustomerService } from '../../core/services/custumer.service';
import { Customer } from '../../models/custumer.model';

const mockCustomer: Customer = {
  id: 'test-id',
  name: 'João Silva',
  email: 'joao@email.com',
  document: '52998224725',
  status: 'active',
  createdAt: new Date()
};

const makeActivatedRoute = (id: string | null) => ({
  snapshot: { paramMap: { get: () => id } }
});

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;
  let serviceSpy: jasmine.SpyObj<CustomerService>;
  let router: Router;

  const setup = async (id: string | null = null) => {
    serviceSpy = jasmine.createSpyObj('CustomerService', ['getById', 'create', 'update']);

    if (id) serviceSpy.getById.and.returnValue(mockCustomer);

    await TestBed.configureTestingModule({
      imports: [CustomerFormComponent],
      providers: [
        provideRouter([]),
        { provide: CustomerService, useValue: serviceSpy },
        { provide: ActivatedRoute, useValue: makeActivatedRoute(id) }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  // ─── Criação ──────────────────────────────────────────────

  describe('modo criação (sem id)', () => {
    beforeEach(async () => await setup());

    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('isEditMode deve ser false', () => {
      expect(component.isEditMode).toBeFalse();
    });

    it('editingId deve ser null', () => {
      expect(component.editingId).toBeNull();
    });

    it('form deve iniciar inválido (campos vazios)', () => {
      expect(component.form.valid).toBeFalse();
    });

    it('form deve iniciar com status "active" por padrão', () => {
      expect(component.form.get('status')?.value).toBe('active');
    });

    it('não deve chamar getById', () => {
      expect(serviceSpy.getById).not.toHaveBeenCalled();
    });
  });

  // ─── Edição ───────────────────────────────────────────────

  describe('modo edição (com id)', () => {
    beforeEach(async () => await setup('test-id'));

    it('isEditMode deve ser true', () => {
      expect(component.isEditMode).toBeTrue();
    });

    it('editingId deve ser o id da rota', () => {
      expect(component.editingId).toBe('test-id');
    });

    it('deve chamar getById com o id correto', () => {
      expect(serviceSpy.getById).toHaveBeenCalledWith('test-id');
    });

    it('deve preencher o form com dados do cliente', () => {
      expect(component.form.get('name')?.value).toBe('João Silva');
      expect(component.form.get('email')?.value).toBe('joao@email.com');
      expect(component.form.get('document')?.value).toBe('52998224725');
      expect(component.form.get('status')?.value).toBe('active');
    });
  });

  // ─── Edição com id inexistente ────────────────────────────

  describe('modo edição com id inexistente', () => {
    it('redireciona para / se cliente não for encontrado', async () => {
      const spy = jasmine.createSpyObj('CustomerService', ['getById', 'create', 'update']);
      spy.getById.and.returnValue(undefined);

      await TestBed.configureTestingModule({
        imports: [CustomerFormComponent],
        providers: [
          provideRouter([]),
          { provide: CustomerService, useValue: spy },
          { provide: ActivatedRoute, useValue: makeActivatedRoute('id-invalido') }
        ]
      }).compileComponents();

      const f = TestBed.createComponent(CustomerFormComponent);
      const testRouter = TestBed.inject(Router);
      spyOn(testRouter, 'navigate').and.resolveTo(true);
      f.detectChanges();

      expect(testRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  // ─── Validações ───────────────────────────────────────────

  describe('validações do form', () => {
    beforeEach(async () => await setup());

    it('campo name inválido se vazio', () => {
      component.form.get('name')?.setValue('');
      expect(component.form.get('name')?.valid).toBeFalse();
    });

    it('campo name inválido se menos de 3 chars', () => {
      component.form.get('name')?.setValue('AB');
      expect(component.form.get('name')?.hasError('minlength')).toBeTrue();
    });

    it('campo name válido com 3+ chars', () => {
      component.form.get('name')?.setValue('Ana');
      expect(component.form.get('name')?.valid).toBeTrue();
    });

    it('campo email inválido se vazio', () => {
      component.form.get('email')?.setValue('');
      expect(component.form.get('email')?.valid).toBeFalse();
    });

    it('campo email inválido se formato errado', () => {
      component.form.get('email')?.setValue('nao-é-email');
      expect(component.form.get('email')?.hasError('email')).toBeTrue();
    });

    it('campo email válido com formato correto', () => {
      component.form.get('email')?.setValue('ok@email.com');
      expect(component.form.get('email')?.valid).toBeTrue();
    });

    it('campo document inválido se vazio', () => {
      component.form.get('document')?.setValue('');
      expect(component.form.get('document')?.valid).toBeFalse();
    });

    it('campo document inválido com CPF errado', () => {
      component.form.get('document')?.setValue('111.111.111-11');
      expect(component.form.get('document')?.hasError('invalidDocument')).toBeTrue();
    });

    it('campo document válido com CPF correto', () => {
      component.form.get('document')?.setValue('52998224725');
      expect(component.form.get('document')?.valid).toBeTrue();
    });

    it('campo status inválido se vazio', () => {
      component.form.get('status')?.setValue('');
      expect(component.form.get('status')?.valid).toBeFalse();
    });
  });

  // ─── hasError / isInvalid ─────────────────────────────────

  describe('helpers de erro', () => {
    beforeEach(async () => await setup());

    it('hasError retorna false se campo não foi tocado', () => {
      expect(component.hasError('name', 'required')).toBeFalse();
    });

    it('hasError retorna true se campo tocado e com erro', () => {
      const ctrl = component.form.get('name')!;
      ctrl.setValue('');
      ctrl.markAsTouched();
      expect(component.hasError('name', 'required')).toBeTrue();
    });

    it('isInvalid retorna false se campo não foi tocado', () => {
      expect(component.isInvalid('name')).toBeFalse();
    });

    it('isInvalid retorna true se campo tocado e inválido', () => {
      const ctrl = component.form.get('name')!;
      ctrl.setValue('');
      ctrl.markAsTouched();
      expect(component.isInvalid('name')).toBeTrue();
    });
  });

  // ─── onSubmit — form inválido ─────────────────────────────

  describe('onSubmit() com form inválido', () => {
    beforeEach(async () => await setup());

    it('não chama create se form inválido', () => {
      component.onSubmit();
      expect(serviceSpy.create).not.toHaveBeenCalled();
    });

    it('marca todos os campos como touched', () => {
      component.onSubmit();
      expect(component.form.touched).toBeTrue();
    });

    it('não navega se form inválido', () => {
      component.onSubmit();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  // ─── onSubmit — criação ───────────────────────────────────

  describe('onSubmit() no modo criação', () => {
    beforeEach(async () => await setup());

    const fillForm = (component: CustomerFormComponent) => {
      component.form.setValue({
        name: 'Maria Souza',
        email: 'maria@email.com',
        document: '52998224725',
        status: 'active'
      });
    };

    it('chama create com payload correto', () => {
      fillForm(component);
      component.onSubmit();
      expect(serviceSpy.create).toHaveBeenCalledWith({
        name: 'Maria Souza',
        email: 'maria@email.com',
        document: '52998224725',
        status: 'active'
      });
    });

    it('não chama update no modo criação', () => {
      fillForm(component);
      component.onSubmit();
      expect(serviceSpy.update).not.toHaveBeenCalled();
    });

    it('navega para / após criar', () => {
      fillForm(component);
      component.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  // ─── onSubmit — edição ────────────────────────────────────

  describe('onSubmit() no modo edição', () => {
    beforeEach(async () => await setup('test-id'));

    it('chama update com id e payload correto', () => {
      component.form.patchValue({ name: 'Nome Editado' });
      component.onSubmit();
      expect(serviceSpy.update).toHaveBeenCalledWith('test-id', jasmine.objectContaining({
        name: 'Nome Editado'
      }));
    });

    it('não chama create no modo edição', () => {
      component.onSubmit();
      expect(serviceSpy.create).not.toHaveBeenCalled();
    });

    it('navega para / após editar', () => {
      component.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

});