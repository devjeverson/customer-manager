/// <reference types="jasmine" />

import { FormControl } from '@angular/forms';
import { documentValidator } from './document.validator';

const ctrl = (value: string | null) =>
  documentValidator(new FormControl(value));

describe('documentValidator', () => {

  // ─── Vazios ───────────────────────────────────────────────

  describe('valores vazios', () => {
    it('retorna null para string vazia', () => {
      expect(ctrl('')).toBeNull();
    });

    it('retorna null para null', () => {
      expect(ctrl(null)).toBeNull();
    });

    it('retorna null para undefined via replace fallback', () => {
      expect(documentValidator(new FormControl(undefined))).toBeNull();
    });
  });

  // ─── Tamanho inválido ─────────────────────────────────────

  describe('tamanho inválido', () => {
    it('rejeita string com menos de 11 dígitos', () => {
      expect(ctrl('123456789')).toEqual({ invalidDocument: true });
    });

    it('rejeita string com 13 dígitos (entre CPF e CNPJ)', () => {
      expect(ctrl('1234567890123')).toEqual({ invalidDocument: true });
    });

    it('rejeita string com mais de 14 dígitos', () => {
      expect(ctrl('123456789012345')).toEqual({ invalidDocument: true });
    });
  });

  // ─── CPF válido ───────────────────────────────────────────

  describe('CPF válido', () => {
    it('aceita CPF com pontuação', () => {
      expect(ctrl('529.982.247-25')).toBeNull();
    });

    it('aceita CPF só com dígitos', () => {
      expect(ctrl('52998224725')).toBeNull();
    });

    it('aceita outro CPF válido', () => {
      expect(ctrl('935.411.347-80')).toBeNull();
    });
  });

  // ─── CPF inválido ─────────────────────────────────────────

  describe('CPF inválido', () => {
    it('rejeita CPF com primeiro dígito verificador errado', () => {
      expect(ctrl('529.982.247-35')).toEqual({ invalidDocument: true });
    });

    it('rejeita CPF com segundo dígito verificador errado', () => {
      expect(ctrl('529.982.247-26')).toEqual({ invalidDocument: true });
    });

    it('rejeita CPF com todos dígitos iguais (111)', () => {
      expect(ctrl('111.111.111-11')).toEqual({ invalidDocument: true });
    });

    it('rejeita CPF com todos dígitos iguais (000)', () => {
      expect(ctrl('000.000.000-00')).toEqual({ invalidDocument: true });
    });

    it('rejeita CPF com todos dígitos iguais (999)', () => {
      expect(ctrl('999.999.999-99')).toEqual({ invalidDocument: true });
    });
  });

  // ─── CNPJ válido ──────────────────────────────────────────

  describe('CNPJ válido', () => {
    it('aceita CNPJ com pontuação', () => {
      expect(ctrl('11.222.333/0001-81')).toBeNull();
    });

    it('aceita CNPJ só com dígitos', () => {
      expect(ctrl('11222333000181')).toBeNull();
    });

    it('aceita outro CNPJ válido', () => {
      expect(ctrl('04.252.011/0001-10')).toBeNull();
    });
  });

  // ─── CNPJ inválido ────────────────────────────────────────

  describe('CNPJ inválido', () => {
    it('rejeita CNPJ com primeiro dígito verificador errado', () => {
      expect(ctrl('11.222.333/0001-91')).toEqual({ invalidDocument: true });
    });

    it('rejeita CNPJ com segundo dígito verificador errado', () => {
      expect(ctrl('11.222.333/0001-82')).toEqual({ invalidDocument: true });
    });

    it('rejeita CNPJ com todos dígitos iguais (11)', () => {
      expect(ctrl('11.111.111/1111-11')).toEqual({ invalidDocument: true });
    });

    it('rejeita CNPJ com todos dígitos iguais (00)', () => {
      expect(ctrl('00.000.000/0000-00')).toEqual({ invalidDocument: true });
    });
  });

});