import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { abelhaSelecionadaGuard } from './core/jogador/abelha-selecionada.guard';

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
    {
        path: '',
        canActivate: [authGuard, abelhaSelecionadaGuard],
        loadComponent: () => import('./game-shell/game-shell.component').then(m => m.GameShellComponent)
    },
];
