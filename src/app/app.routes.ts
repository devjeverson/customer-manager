import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/customer-list/customer-list.component')
        .then(m => m.CustomerListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./features/customer-form/customer-form.component')
        .then(m => m.CustomerFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./features/customer-form/customer-form.component')
        .then(m => m.CustomerFormComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];