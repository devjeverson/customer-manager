export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  document: string; // CPF ou CNPJ
  status: CustomerStatus;
  createdAt: Date;
}