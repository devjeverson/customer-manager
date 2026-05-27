import { AbstractControl, ValidationErrors } from '@angular/forms';

export function documentValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.replace(/\D/g, '') ?? '';

  if (!value) return null;

  if (value.length === 11) return validateCPF(value);
  if (value.length === 14) return validateCNPJ(value);

  return { invalidDocument: true };
}

// ─── CPF ─────────────────────────────────────────────────────

function validateCPF(cpf: string): ValidationErrors | null {
  if (/^(\d)\1+$/.test(cpf)) return { invalidDocument: true };

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return { invalidDocument: true };

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[10])) return { invalidDocument: true };

  return null;
}

// ─── CNPJ ────────────────────────────────────────────────────

function validateCNPJ(cnpj: string): ValidationErrors | null {
  if (/^(\d)\1+$/.test(cnpj)) return { invalidDocument: true };

  const calcDigit = (cnpj: string, length: number): number => {
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(cnpj[length - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11);
  };

  if (calcDigit(cnpj, 12) !== parseInt(cnpj[12])) return { invalidDocument: true };
  if (calcDigit(cnpj, 13) !== parseInt(cnpj[13])) return { invalidDocument: true };

  return null;
}