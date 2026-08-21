import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    {
        path: 'cadastro',
        loadComponent: () => import('./cadastro/cadastro.component').then(m => m.CadastroComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'abelhas',
        canActivate: [authGuard],
        loadComponent: () => import('./abelhas/selecao-abelha.component').then(m => m.SelecaoAbelhaComponent)
    },
];
