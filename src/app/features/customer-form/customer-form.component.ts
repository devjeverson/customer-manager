import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { CustomerService } from '../../core/services/custumer.service';
import { documentValidator } from '../../shared/validators/document.validator';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editingId: string | null = null;
  isEditMode = false;

  form = this.fb.group({
    name:     ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    document: ['', [Validators.required, documentValidator]],
    status:   ['active', Validators.required],
  });

  ngOnInit() {
    this.editingId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.editingId;

    if (this.isEditMode && this.editingId) {
      const customer = this.customerService.getById(this.editingId);

      if (customer) {
        this.form.patchValue(customer);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, document, status } = this.form.getRawValue();

    const payload = {
      name: name!,
      email: email!,
      document: document!,
      status: status as 'active' | 'inactive',
    };

    if (this.isEditMode && this.editingId) {
      this.customerService.update(this.editingId, payload);
    } else {
      this.customerService.create(payload);
    }

    this.router.navigate(['/']);
  }

  // ─── Helpers para erros no template ──────────────────────

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}