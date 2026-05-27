import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>people</mat-icon>
      <span class="toolbar-title" routerLink="/">Customer Manager</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/">
        <mat-icon>list</mat-icon>
        Clientes
      </button>
      <button mat-button routerLink="/new">
        <mat-icon>add</mat-icon>
        Novo
      </button>
    </mat-toolbar>

    <router-outlet />
  `,
  styles: [`
    mat-toolbar {
      gap: 8px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .toolbar-title {
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      margin-left: 8px;
    }

    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent {}