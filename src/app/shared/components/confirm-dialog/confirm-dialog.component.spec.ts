import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

const makeData = (overrides: Partial<ConfirmDialogData> = {}): ConfirmDialogData => ({
  title: 'Excluir Cliente',
  message: 'Tem certeza que deseja excluir "João"?',
  confirmLabel: 'Excluir',
  cancelLabel: 'Cancelar',
  ...overrides
});

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const setup = async (data: ConfirmDialogData = makeData()) => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  // ─── Criação ──────────────────────────────────────────────

  describe('instância', () => {
    it('deve criar o componente', async () => {
      await setup();
      expect(component).toBeTruthy();
    });

    it('deve receber os dados via MAT_DIALOG_DATA', async () => {
      await setup();
      expect(component.data.title).toBe('Excluir Cliente');
      expect(component.data.message).toContain('João');
    });
  });

  // ─── Labels customizados ──────────────────────────────────

  describe('labels', () => {
    it('deve usar confirmLabel e cancelLabel passados', async () => {
      await setup(makeData({ confirmLabel: 'Sim, excluir', cancelLabel: 'Não' }));
      expect(component.data.confirmLabel).toBe('Sim, excluir');
      expect(component.data.cancelLabel).toBe('Não');
    });

    it('deve aceitar data sem confirmLabel (undefined)', async () => {
      await setup(makeData({ confirmLabel: undefined }));
      expect(component.data.confirmLabel).toBeUndefined();
    });

    it('deve aceitar data sem cancelLabel (undefined)', async () => {
      await setup(makeData({ cancelLabel: undefined }));
      expect(component.data.cancelLabel).toBeUndefined();
    });
  });

  // ─── confirm() ────────────────────────────────────────────

  describe('confirm()', () => {
    it('deve fechar o dialog com true', async () => {
      await setup();
      component.confirm();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });

    it('deve chamar close apenas uma vez', async () => {
      await setup();
      component.confirm();
      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    });
  });

  // ─── cancel() ─────────────────────────────────────────────

  describe('cancel()', () => {
    it('deve fechar o dialog com false', async () => {
      await setup();
      component.cancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    });

    it('deve chamar close apenas uma vez', async () => {
      await setup();
      component.cancel();
      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    });
  });

  // ─── confirm e cancel são distintos ──────────────────────

  describe('confirm vs cancel', () => {
    it('confirm e cancel fecham com valores diferentes', async () => {
      await setup();
      component.confirm();
      component.cancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
      expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    });
  });

});