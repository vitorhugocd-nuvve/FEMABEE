# Auth + Bee Creation Onboarding Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the Angular front-end to the real NestJS backend (`../new-back`) for account creation, login, and creating/selecting one of up to 3 "abelhas" (runs) per player, replacing the current fully-mocked app boot with a real auth + onboarding flow.

**Architecture:** New `AuthService`/`JogadorService` (signals-based, `providedIn: 'root'`) call the backend via `HttpClient` with a functional interceptor attaching the JWT. Two new public screens (`/cadastro`, `/login`) and one protected screen (`/abelhas`, a 3-slot save-select screen) sit in front of the existing game. The existing `App` root component — which today unconditionally renders `<app-map />` — is stripped down to a bare `<router-outlet />`; everything it used to render directly (map, challenge overlays, dialogue) moves into a new `GameShellComponent` behind two route guards (must be logged in, must have picked an abelha).

**Tech Stack:** Angular 21 standalone components, signals, Angular Router (functional guards), Angular `HttpClient` (functional interceptors), Reactive Forms (`@angular/forms` — first use in this repo), Vitest (`@angular/build:unit-test`) for integration tests against the real running backend.

**Spec:** [docs/superpowers/specs/2026-08-21-auth-bee-creation-design.md](../specs/2026-08-21-auth-bee-creation-design.md)

## Global Constraints

- All new identifiers, UI copy, and code comments are in Portuguese, matching the rest of the repo (`Desafio`, `Mapa`, `solicitando`, etc.).
- Standalone components only; no explicit `standalone: true`.
- Signals for state, `computed()` for derived state; never `.mutate()` — use `.update()`/`.set()`.
- `input()`/`output()`/`model()` functions, not decorators. `inject()`, not constructor injection.
- Services expose private `_signal` + public `readonly signal = this._signal.asReadonly()` pairs (see `MapaAtualService`, `DesafioBaseService`).
- Reactive forms for all new forms (first use of `@angular/forms` in this repo — no template-driven forms).
- Native control flow (`@if`/`@for`/`@switch`), not `*ngIf`/`*ngFor`.
- `bee-` prefixed UI primitives are imported by relative path from `src/ui/`, never via a path alias.
- Backend base URL: `http://localhost:3000/api`. Every response is enveloped as `{ sucesso, mensagem, status, dados }`, success or error, with error messages in `mensagem`.
- No test files exist yet in this repo. This plan introduces the first ones: real integration tests (Task 1 and Task 2) that hit the actual running backend — no HTTP mocking. They require `../new-back` running locally with its database up.

---

## File Structure

**New files:**
- `src/app/core/constants/api.ts` — `API_BASE_URL` constant.
- `src/app/core/http/resposta-api.ts` — shared `RespostaApi<T>` envelope type.
- `src/app/core/auth/auth.service.ts` — cadastro/login/logout, token signal, persisted to `localStorage`.
- `src/app/core/auth/auth.interceptor.ts` — attaches `Authorization: Bearer`, logs out + redirects on 401.
- `src/app/core/auth/auth.guard.ts` — `CanActivateFn`, redirects to `/login` if not authenticated.
- `src/test/integration/auth.integration.spec.ts` — real HTTP tests for `AuthService`.
- `src/app/core/models/abelha/abelha.ts` — `AbelhaProps`/`Abelha`.
- `src/app/core/models/jogador/jogador.ts` — `JogadorProps`/`Jogador`.
- `src/app/core/jogador/jogador.service.ts` — `buscarPerfil()`/`criarJogador()`/`criarAbelha()`.
- `src/test/integration/jogador.integration.spec.ts` — real HTTP tests for `JogadorService`.
- `src/app/cadastro/cadastro.component.ts` — account creation screen.
- `src/app/core/jogador/abelha-ativa.service.ts` — in-memory "which abelha is the active run" signal.
- `src/app/core/jogador/abelha-selecionada.guard.ts` — `CanActivateFn`, redirects to `/abelhas` if none picked.
- `src/app/abelhas/criar-abelha.component.ts` — bee-creation modal (conditionally also collects player info on the very first bee).
- `src/app/abelhas/selecao-abelha.component.ts` — the 3-slot save-select screen.
- `src/app/game-shell/game-shell.component.ts` — everything `App`'s template used to render directly (map, challenge overlay switch, dialogue), now route-gated.

**Modified files:**
- `src/app/app.config.ts` — add `provideHttpClient(withInterceptors([authInterceptor]))`.
- `src/app/app.routes.ts` — add `/cadastro`, `/login` (existing), `/abelhas` (guarded), `''` (guarded, loads `GameShellComponent`).
- `src/app/app.ts` — becomes a bare `<router-outlet />`.
- `src/app/login/login.component.ts` — reworked to email + real `AuthService` call (was a static template with no logic, "Nome" field instead of email).

---

### Task 1: Autenticação — HttpClient, AuthService, interceptor, guard

**Files:**
- Create: `src/app/core/constants/api.ts`
- Create: `src/app/core/http/resposta-api.ts`
- Create: `src/app/core/auth/auth.service.ts`
- Create: `src/app/core/auth/auth.interceptor.ts`
- Create: `src/app/core/auth/auth.guard.ts`
- Test: `src/test/integration/auth.integration.spec.ts`
- Modify: `src/app/app.config.ts`

**Interfaces:**
- Consumes: nothing from other tasks (foundational).
- Produces:
  - `API_BASE_URL: string` (`core/constants/api.ts`)
  - `RespostaApi<T> { sucesso: boolean; mensagem: string; status: number; dados: T }` (`core/http/resposta-api.ts`)
  - `AuthService` (`providedIn: 'root'`): `token: Signal<string | null>`, `autenticado: Signal<boolean>`, `solicitando: Signal<boolean>`, `cadastrar(payload: { nomeDeUsuario: string; email: string; senha: string }): Promise<void>`, `login(payload: { email: string; senha: string }): Promise<void>`, `logout(): void`
  - `authInterceptor: HttpInterceptorFn`
  - `authGuard: CanActivateFn`
  - All later tasks that call the backend (Task 2 onward) depend on `AuthService`/`authInterceptor` being wired.

- [ ] **Step 1: Create the API constant**

`src/app/core/constants/api.ts`:
```ts
export const API_BASE_URL = 'http://localhost:3000/api';
```

- [ ] **Step 2: Create the shared response envelope type**

`src/app/core/http/resposta-api.ts`:
```ts
export interface RespostaApi<T> {
    sucesso: boolean;
    mensagem: string;
    status: number;
    dados: T;
}
```

- [ ] **Step 3: Create `AuthService`**

`src/app/core/auth/auth.service.ts`:
```ts
import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_BASE_URL } from "../constants/api";
import { RespostaApi } from "../http/resposta-api";

const CHAVE_TOKEN = "femabee_token";

export interface CadastrarUsuarioPayload {
    nomeDeUsuario: string;
    email: string;
    senha: string;
}

export interface LoginPayload {
    email: string;
    senha: string;
}

/** Sessão do usuário: cadastro/login/logout contra o backend real, token persistido no localStorage. */
@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);

    private readonly _token = signal<string | null>(localStorage.getItem(CHAVE_TOKEN));
    private readonly _solicitando = signal(false);

    readonly token = this._token.asReadonly();
    readonly solicitando = this._solicitando.asReadonly();
    readonly autenticado = computed(() => this._token() !== null);

    async cadastrar(payload: CadastrarUsuarioPayload): Promise<void> {
        this._solicitando.set(true);
        try {
            await firstValueFrom(
                this.http.post<RespostaApi<undefined>>(`${API_BASE_URL}/autenticacao`, payload),
            );
        } finally {
            this._solicitando.set(false);
        }
    }

    async login(payload: LoginPayload): Promise<void> {
        this._solicitando.set(true);
        try {
            const resposta = await firstValueFrom(
                this.http.post<RespostaApi<{ token: string }>>(`${API_BASE_URL}/autenticacao/login`, payload),
            );
            this.definirToken(resposta.dados.token);
        } finally {
            this._solicitando.set(false);
        }
    }

    logout(): void {
        this.definirToken(null);
    }

    private definirToken(token: string | null): void {
        this._token.set(token);
        if (token) {
            localStorage.setItem(CHAVE_TOKEN, token);
        } else {
            localStorage.removeItem(CHAVE_TOKEN);
        }
    }
}
```

- [ ] **Step 4: Create the auth interceptor**

`src/app/core/auth/auth.interceptor.ts`:
```ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";

/** Anexa o Bearer token em toda chamada; em 401, desloga e manda pro login (token expirado/inválido). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.token();
    const requisicaoAutenticada = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(requisicaoAutenticada).pipe(
        catchError((erro) => {
            if (erro.status === 401) {
                authService.logout();
                router.navigateByUrl('/login');
            }
            return throwError(() => erro);
        }),
    );
};
```

- [ ] **Step 5: Create the auth guard**

`src/app/core/auth/auth.guard.ts`:
```ts
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.autenticado()) return true;

    router.navigateByUrl('/login');
    return false;
};
```

- [ ] **Step 6: Wire `HttpClient` + the interceptor into the app**

Modify `src/app/app.config.ts`:
```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { ScreenProviders } from '../services/tela/screen-service.providers';
import { authInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    ...ScreenProviders,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
};
```

- [ ] **Step 7: Write the integration tests**

`src/test/integration/auth.integration.spec.ts`:
```ts
import { HttpErrorResponse } from "@angular/common/http";
import { provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "../../app/core/auth/auth.service";

function sufixoUnico(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const SENHA_VALIDA = 'SenhaForte#123';

describe('AuthService (integração real com o backend em ../new-back)', () => {
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient()],
        });
        authService = TestBed.inject(AuthService);
    });

    it('cadastra um usuário novo com sucesso', async () => {
        const sufixo = sufixoUnico();
        await expect(
            authService.cadastrar({
                nomeDeUsuario: `teste_${sufixo}`,
                email: `teste-${sufixo}@femabee.test`,
                senha: SENHA_VALIDA,
            }),
        ).resolves.toBeUndefined();
    });

    it('rejeita cadastro com email duplicado', async () => {
        const sufixo = sufixoUnico();
        const payload = {
            nomeDeUsuario: `teste_${sufixo}`,
            email: `teste-${sufixo}@femabee.test`,
            senha: SENHA_VALIDA,
        };
        await authService.cadastrar(payload);

        await expect(authService.cadastrar(payload)).rejects.toMatchObject({
            status: 409,
        } satisfies Partial<HttpErrorResponse>);
    });

    it('loga com credenciais corretas e guarda o token', async () => {
        const sufixo = sufixoUnico();
        const email = `teste-${sufixo}@femabee.test`;
        await authService.cadastrar({ nomeDeUsuario: `teste_${sufixo}`, email, senha: SENHA_VALIDA });

        await authService.login({ email, senha: SENHA_VALIDA });

        expect(authService.token()).toBeTruthy();
        expect(authService.autenticado()).toBe(true);
    });

    it('rejeita login com senha errada', async () => {
        const sufixo = sufixoUnico();
        const email = `teste-${sufixo}@femabee.test`;
        await authService.cadastrar({ nomeDeUsuario: `teste_${sufixo}`, email, senha: SENHA_VALIDA });

        await expect(
            authService.login({ email, senha: 'SenhaErrada#999' }),
        ).rejects.toMatchObject({ status: 401 });
    });
});
```

- [ ] **Step 8: Start the backend locally**

In `../new-back`, make sure a `.env` exists with at least `JWT_SECRET` and DB credentials matching a running Postgres instance, then run:
```bash
npm run start:dev
```
Expected: `Servidor rodando em http://localhost:3000/api` in the console.

- [ ] **Step 9: Run the integration tests**

Run: `pnpm test -- src/test/integration/auth.integration.spec.ts`
Expected: all 4 tests PASS against the live backend.

- [ ] **Step 10: Commit**

```bash
git add src/app/core/constants/api.ts src/app/core/http/resposta-api.ts src/app/core/auth/ src/test/integration/auth.integration.spec.ts src/app/app.config.ts
git commit -m "feat: wire HttpClient auth (cadastro/login/logout) to the real backend"
```

---

### Task 2: Domínio Jogador/Abelha — modelos e JogadorService

**Files:**
- Create: `src/app/core/models/abelha/abelha.ts`
- Create: `src/app/core/models/jogador/jogador.ts`
- Create: `src/app/core/jogador/jogador.service.ts`
- Test: `src/test/integration/jogador.integration.spec.ts`

**Interfaces:**
- Consumes: `API_BASE_URL` (`core/constants/api.ts`, Task 1), `RespostaApi<T>` (`core/http/resposta-api.ts`, Task 1), `AuthService.cadastrar()`/`.login()` (Task 1, used only by the test to get an authenticated session), `authInterceptor` (Task 1, wired globally already).
- Produces:
  - `Abelha` (`core/models/abelha/abelha.ts`): getters `id: string`, `nome: string`, `tamanho: TamanhoAbelha | undefined`.
  - `Jogador` (`core/models/jogador/jogador.ts`): getters `id: string`, `abelhas: Abelha[]`.
  - `JogadorService` (`providedIn: 'root'`): `jogador: Signal<Jogador | null>`, `solicitando: Signal<boolean>`, `buscarPerfil(): Promise<Jogador | null>` (resolves `null` on 404, does not throw), `criarJogador(payload: { nome: string; comidaFavorita: string; abelha: { nome: string; tamanho?: TamanhoAbelha } }): Promise<Jogador>`, `criarAbelha(payload: { nome: string; tamanho?: TamanhoAbelha }): Promise<Abelha>`.
  - Task 5 (`AbelhaAtivaService`/guard), Task 6 (`CriarAbelhaComponent`) and Task 7 (`SelecaoAbelhaComponent`) all depend on this exact `JogadorService` surface.

- [ ] **Step 1: Create the `Abelha` model**

`src/app/core/models/abelha/abelha.ts`:
```ts
import { TamanhoAbelha } from "../aparencia/tamanhos";

export type AbelhaProps = {
    id: string;
    nome: string;
    tamanho?: TamanhoAbelha;
}

/**
 * O backend guarda `tamanho` como texto livre; aqui tipamos como TamanhoAbelha
 * porque só o form de criação de abelha (deste app) escreve esse campo.
 */
export class Abelha {
    constructor(private props: AbelhaProps) { }

    get id() { return this.props.id; }
    get nome() { return this.props.nome; }
    get tamanho() { return this.props.tamanho; }
}
```

- [ ] **Step 2: Create the `Jogador` model**

`src/app/core/models/jogador/jogador.ts`:
```ts
import { Abelha, AbelhaProps } from "../abelha/abelha";

export type JogadorProps = {
    id: string;
    abelhas: AbelhaProps[];
}

export class Jogador {
    constructor(private props: JogadorProps) { }

    get id() { return this.props.id; }
    get abelhas() { return this.props.abelhas.map(abelha => new Abelha(abelha)); }
}
```

- [ ] **Step 3: Create `JogadorService`**

`src/app/core/jogador/jogador.service.ts`:
```ts
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { catchError, firstValueFrom, of } from "rxjs";
import { API_BASE_URL } from "../constants/api";
import { RespostaApi } from "../http/resposta-api";
import { Abelha, AbelhaProps } from "../models/abelha/abelha";
import { Jogador, JogadorProps } from "../models/jogador/jogador";
import { TamanhoAbelha } from "../models/aparencia/tamanhos";

export interface CriarJogadorPayload {
    nome: string;
    comidaFavorita: string;
    abelha: { nome: string; tamanho?: TamanhoAbelha };
}

export interface CriarAbelhaPayload {
    nome: string;
    tamanho?: TamanhoAbelha;
}

/** Perfil do jogador logado (nome, comida favorita, abelhas) contra o backend real. */
@Injectable({ providedIn: 'root' })
export class JogadorService {
    private readonly http = inject(HttpClient);

    private readonly _jogador = signal<Jogador | null>(null);
    private readonly _solicitando = signal(false);

    readonly jogador = this._jogador.asReadonly();
    readonly solicitando = this._solicitando.asReadonly();

    /** Resolve `null` (não lança) quando o usuário ainda não tem jogador cadastrado — 404 é um estado válido aqui. */
    async buscarPerfil(): Promise<Jogador | null> {
        this._solicitando.set(true);
        try {
            const resposta = await firstValueFrom(
                this.http
                    .get<RespostaApi<JogadorProps> | null>(`${API_BASE_URL}/jogador/perfil`)
                    .pipe(
                        catchError((erro: HttpErrorResponse) => {
                            if (erro.status === 404) return of(null);
                            throw erro;
                        }),
                    ),
            );

            const jogador = resposta ? new Jogador(resposta.dados) : null;
            this._jogador.set(jogador);
            return jogador;
        } finally {
            this._solicitando.set(false);
        }
    }

    async criarJogador(payload: CriarJogadorPayload): Promise<Jogador> {
        this._solicitando.set(true);
        try {
            const resposta = await firstValueFrom(
                this.http.post<RespostaApi<JogadorProps>>(`${API_BASE_URL}/jogador`, payload),
            );
            const jogador = new Jogador(resposta.dados);
            this._jogador.set(jogador);
            return jogador;
        } finally {
            this._solicitando.set(false);
        }
    }

    /** O backend só retorna a abelha criada (não o jogador inteiro), então recarrega o perfil pra manter `jogador()` consistente. */
    async criarAbelha(payload: CriarAbelhaPayload): Promise<Abelha> {
        const resposta = await firstValueFrom(
            this.http.post<RespostaApi<AbelhaProps>>(`${API_BASE_URL}/jogador/abelhas`, payload),
        );
        await this.buscarPerfil();
        return new Abelha(resposta.dados);
    }
}
```

- [ ] **Step 4: Write the integration tests**

`src/test/integration/jogador.integration.spec.ts`:
```ts
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "../../app/core/auth/auth.service";
import { authInterceptor } from "../../app/core/auth/auth.interceptor";
import { JogadorService } from "../../app/core/jogador/jogador.service";
import { TamanhoAbelha } from "../../app/core/models/aparencia/tamanhos";

function sufixoUnico(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const SENHA_VALIDA = 'SenhaForte#123';

async function criarUsuarioAutenticado(authService: AuthService): Promise<void> {
    const sufixo = sufixoUnico();
    const email = `teste-${sufixo}@femabee.test`;
    await authService.cadastrar({ nomeDeUsuario: `teste_${sufixo}`, email, senha: SENHA_VALIDA });
    await authService.login({ email, senha: SENHA_VALIDA });
}

describe('JogadorService (integração real com o backend em ../new-back)', () => {
    let authService: AuthService;
    let jogadorService: JogadorService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(withInterceptors([authInterceptor]))],
        });
        authService = TestBed.inject(AuthService);
        jogadorService = TestBed.inject(JogadorService);
        await criarUsuarioAutenticado(authService);
    });

    it('retorna null quando o usuário ainda não tem jogador', async () => {
        const jogador = await jogadorService.buscarPerfil();
        expect(jogador).toBeNull();
    });

    it('cria o jogador junto com a primeira abelha', async () => {
        const jogador = await jogadorService.criarJogador({
            nome: 'Jogador Teste',
            comidaFavorita: 'Mel',
            abelha: { nome: 'Abelha 1', tamanho: TamanhoAbelha.AltaGorda },
        });

        expect(jogador.abelhas).toHaveLength(1);
        expect(jogador.abelhas[0].nome).toBe('Abelha 1');
    });

    it('rejeita criar um segundo jogador pro mesmo usuário', async () => {
        await jogadorService.criarJogador({
            nome: 'Jogador Teste',
            comidaFavorita: 'Mel',
            abelha: { nome: 'Abelha 1' },
        });

        await expect(
            jogadorService.criarJogador({
                nome: 'Outro',
                comidaFavorita: 'Pólen',
                abelha: { nome: 'Abelha X' },
            }),
        ).rejects.toMatchObject({ status: 409 });
    });

    it('permite até 3 abelhas e rejeita a 4ª', async () => {
        await jogadorService.criarJogador({
            nome: 'Jogador Teste',
            comidaFavorita: 'Mel',
            abelha: { nome: 'Abelha 1' },
        });
        await jogadorService.criarAbelha({ nome: 'Abelha 2' });
        await jogadorService.criarAbelha({ nome: 'Abelha 3' });

        expect(jogadorService.jogador()?.abelhas).toHaveLength(3);

        await expect(jogadorService.criarAbelha({ nome: 'Abelha 4' })).rejects.toMatchObject({
            status: 400,
        });
    });
});
```

- [ ] **Step 5: Run the integration tests (backend must still be running from Task 1)**

Run: `pnpm test -- src/test/integration/jogador.integration.spec.ts`
Expected: all 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/core/models/abelha/ src/app/core/models/jogador/ src/app/core/jogador/jogador.service.ts src/test/integration/jogador.integration.spec.ts
git commit -m "feat: add Jogador/Abelha models and JogadorService against the real backend"
```

---

### Task 3: Rework do Login

**Files:**
- Modify: `src/app/login/login.component.ts`

**Interfaces:**
- Consumes: `AuthService.login()`, `.solicitando` (Task 1); `IndicatorComponent`/`Indication` (existing, `src/ui/indicator/`); `SomService.sucesso()`/`.erro()` (existing, `src/services/som/som.service.ts`).
- Produces: nothing new consumed by later tasks — `/login` route already points at this component in `app.routes.ts`.

- [ ] **Step 1: Replace the component**

The existing file has a static template (no `imports` logic, "Nome" field, non-functional "Lembrar-me"/"Esqueci a Senha"). Replace `src/app/login/login.component.ts` entirely with:
```ts
import { Component, inject, viewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { TextComponent } from "../../ui/typography/text.component";
import { LinkComponent } from "../../ui/typography/link.component";
import { IconComponent } from "../../ui/icon/icon.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { LabelComponent } from "../../ui/label/label.component";
import { FieldComponent } from "../../ui/field/field.component";
import { TitleComponent } from "../../ui/typography/title.component";
import { BeeCardContentComponent, BeeCardHeaderComponent, BeeCardComponent } from "../../ui/card/card.component";
import { InputComponent } from "../../ui/input/input.component";
import { IndicatorComponent } from "../../ui/indicator/indicator.component";
import { Indication } from "../../ui/indicator/indication";
import { AuthService } from "../core/auth/auth.service";
import { SomService } from "../../services/som/som.service";

@Component({
    selector: 'bee-login',
    template: `
    <bee-card class="w-fit">
        <bee-card-header>
            /realizar_login
            <a bee-button size="small" href="/cadastro">
                Cadastrar-se
                <bee-icon icon="external-link" />
            </a>
        </bee-card-header>
        <bee-card-content class="flex items-center justify-center">
            <form class="w-full max-w-full md:max-w-xl flex justify-center flex-col gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
                <bee-title> Eaí! Bem vindo. </bee-title>

                <bee-field>
                    <label bee-label for="input-email">Email</label>
                    <input type="email" bee-input id="input-email" formControlName="email" />
                </bee-field>

                <bee-field>
                    <label bee-label for="input-senha">Senha</label>
                    <input type="password" bee-input id="input-senha" formControlName="senha" />
                </bee-field>

                <bee-indicator class="w-full!" #indicator />

                <button fluid bee-button type="submit" [disabled]="form.invalid || authService.solicitando()">
                    <bee-icon icon="login-sharp" />
                    Entrar
                </button>

                <hr>

                <div class="w-full flex flex-row items-center justify-center gap-2">
                    <bee-text>Não tem uma conta? </bee-text>
                    <bee-link href="/cadastro" class="text-amber-600!">Cadastre-se</bee-link>
                </div>
            </form>
        </bee-card-content>
    </bee-card>

    <img src="/login-image.png" class="w-1/2" alt="">
    `,
    host: {
        class: 'h-screen w-screen flex flex-row gap-16 items-center justify-center pattern-background'
    },
    imports: [TextComponent, LinkComponent, IconComponent, ButtonComponent, LabelComponent, FieldComponent, TitleComponent, BeeCardContentComponent, BeeCardHeaderComponent, BeeCardComponent, InputComponent, ReactiveFormsModule, IndicatorComponent]
})
export class LoginComponent {
    protected readonly authService = inject(AuthService);
    private readonly somService = inject(SomService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly router = inject(Router);

    private readonly indicator = viewChild<IndicatorComponent>('indicator');

    protected readonly form = this.formBuilder.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', Validators.required],
    });

    protected async onSubmit(): Promise<void> {
        if (this.form.invalid) return;

        const { email, senha } = this.form.getRawValue();

        try {
            await this.authService.login({ email, senha });
            this.somService.sucesso();
            this.router.navigateByUrl('/abelhas');
        } catch (erro) {
            this.somService.erro();
            const mensagem = erro instanceof HttpErrorResponse
                ? (erro.error?.mensagem ?? 'Não foi possível entrar.')
                : 'Não foi possível entrar.';
            this.indicator()?.show(new Indication({ title: 'Ops!', message: mensagem, severity: 'danger', ttlInMs: 3000 }));
        }
    }
}
```

Note: this drops the non-functional "Lembrar-me" checkbox and "Esqueci a Senha" link from the old stub — neither has a backend counterpart (no remember-me semantics beyond the token already persisting in `localStorage`; no password-reset endpoint), so they were dead UI promising features that don't exist.

- [ ] **Step 2: Verify it compiles**

Run: `pnpm exec tsc -p tsconfig.app.json --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/login/login.component.ts
git commit -m "feat: wire the login screen to AuthService (email instead of username)"
```

---

### Task 4: Tela de Cadastro

**Files:**
- Create: `src/app/cadastro/cadastro.component.ts`
- Modify: `src/app/app.routes.ts`

**Interfaces:**
- Consumes: `AuthService.cadastrar()`, `.login()`, `.solicitando` (Task 1).
- Produces: `/cadastro` route, already linked to from Task 3's login screen.

- [ ] **Step 1: Create the component**

`src/app/cadastro/cadastro.component.ts`:
```ts
import { Component, inject, viewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { TextComponent } from "../../ui/typography/text.component";
import { LinkComponent } from "../../ui/typography/link.component";
import { IconComponent } from "../../ui/icon/icon.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { LabelComponent } from "../../ui/label/label.component";
import { FieldComponent } from "../../ui/field/field.component";
import { TitleComponent } from "../../ui/typography/title.component";
import { BeeCardContentComponent, BeeCardHeaderComponent, BeeCardComponent } from "../../ui/card/card.component";
import { InputComponent } from "../../ui/input/input.component";
import { IndicatorComponent } from "../../ui/indicator/indicator.component";
import { Indication } from "../../ui/indicator/indication";
import { AuthService } from "../core/auth/auth.service";
import { SomService } from "../../services/som/som.service";

@Component({
    selector: 'bee-cadastro',
    template: `
    <bee-card class="w-fit">
        <bee-card-header>
            /criar_conta
            <a bee-button size="small" href="/login">
                Já tenho conta
                <bee-icon icon="external-link" />
            </a>
        </bee-card-header>
        <bee-card-content class="flex items-center justify-center">
            <form class="w-full max-w-full md:max-w-xl flex justify-center flex-col gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
                <bee-title> Bem vindo à colmeia! </bee-title>

                <bee-field>
                    <label bee-label for="input-nome-usuario">Nome de usuário</label>
                    <input type="text" bee-input id="input-nome-usuario" formControlName="nomeDeUsuario" />
                </bee-field>

                <bee-field>
                    <label bee-label for="input-email">Email</label>
                    <input type="email" bee-input id="input-email" formControlName="email" />
                </bee-field>

                <bee-field>
                    <label bee-label for="input-senha">Senha</label>
                    <input type="password" bee-input id="input-senha" formControlName="senha" />
                    <bee-text class="text-neutral-500!">Mín. 8 caracteres, com maiúscula, minúscula, número e símbolo.</bee-text>
                </bee-field>

                <bee-indicator class="w-full!" #indicator />

                <button fluid bee-button type="submit" [disabled]="form.invalid || authService.solicitando()">
                    <bee-icon icon="plus" />
                    Cadastrar
                </button>

                <hr>

                <div class="w-full flex flex-row items-center justify-center gap-2">
                    <bee-text>Já tem uma conta? </bee-text>
                    <bee-link href="/login" class="text-amber-600!">Entrar</bee-link>
                </div>
            </form>
        </bee-card-content>
    </bee-card>

    <img src="/login-image.png" class="w-1/2" alt="">
    `,
    host: {
        class: 'h-screen w-screen flex flex-row gap-16 items-center justify-center pattern-background'
    },
    imports: [TextComponent, LinkComponent, IconComponent, ButtonComponent, LabelComponent, FieldComponent, TitleComponent, BeeCardContentComponent, BeeCardHeaderComponent, BeeCardComponent, InputComponent, ReactiveFormsModule, IndicatorComponent]
})
export class CadastroComponent {
    protected readonly authService = inject(AuthService);
    private readonly somService = inject(SomService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly router = inject(Router);

    private readonly indicator = viewChild<IndicatorComponent>('indicator');

    protected readonly form = this.formBuilder.nonNullable.group({
        nomeDeUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(8)]],
    });

    protected async onSubmit(): Promise<void> {
        if (this.form.invalid) return;

        const valores = this.form.getRawValue();

        try {
            await this.authService.cadastrar(valores);
            this.somService.sucesso();
            await this.authService.login({ email: valores.email, senha: valores.senha });
            this.router.navigateByUrl('/abelhas');
        } catch (erro) {
            this.somService.erro();
            const mensagem = erro instanceof HttpErrorResponse
                ? (erro.error?.mensagem ?? 'Não foi possível criar sua conta.')
                : 'Não foi possível criar sua conta.';
            this.indicator()?.show(new Indication({ title: 'Ops!', message: mensagem, severity: 'danger', ttlInMs: 3000 }));
        }
    }
}
```

Note: `senha` here only checks `minLength(8)` client-side (not the full uppercase/lowercase/number/symbol rule) — the backend is the source of truth for that and returns a clear `mensagem` if it's not strong enough, shown via the indicator. Duplicating the full password-strength regex client-side isn't worth it for one field.

- [ ] **Step 2: Add the route**

Modify `src/app/app.routes.ts`:
```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'cadastro',
        loadComponent: () => import('./cadastro/cadastro.component').then(m => m.CadastroComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
];
```

- [ ] **Step 3: Verify it compiles**

Run: `pnpm exec tsc -p tsconfig.app.json --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/cadastro/ src/app/app.routes.ts
git commit -m "feat: add the account creation (cadastro) screen"
```

---

### Task 5: AbelhaAtivaService + guard de abelha selecionada

**Files:**
- Create: `src/app/core/jogador/abelha-ativa.service.ts`
- Create: `src/app/core/jogador/abelha-selecionada.guard.ts`

**Interfaces:**
- Consumes: nothing (in-memory only).
- Produces:
  - `AbelhaAtivaService` (`providedIn: 'root'`): `abelhaAtivaId: Signal<string | null>`, `selecionar(id: string): void`, `limpar(): void`.
  - `abelhaSelecionadaGuard: CanActivateFn`.
  - Task 7 (`SelecaoAbelhaComponent`) calls `.selecionar()`; Task 8's default route uses the guard.

- [ ] **Step 1: Create `AbelhaAtivaService`**

`src/app/core/jogador/abelha-ativa.service.ts`:
```ts
import { Injectable, signal } from "@angular/core";

/**
 * Qual abelha (run) está ativa agora — só em memória, de propósito: um reload
 * volta pra tela de seleção em vez de reabrir uma run "esquecida", evitando
 * estado obsoleto (ex.: abelha removida em outra aba).
 */
@Injectable({ providedIn: 'root' })
export class AbelhaAtivaService {
    private readonly _abelhaAtivaId = signal<string | null>(null);

    readonly abelhaAtivaId = this._abelhaAtivaId.asReadonly();

    selecionar(id: string): void {
        this._abelhaAtivaId.set(id);
    }

    limpar(): void {
        this._abelhaAtivaId.set(null);
    }
}
```

- [ ] **Step 2: Create the guard**

`src/app/core/jogador/abelha-selecionada.guard.ts`:
```ts
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AbelhaAtivaService } from "./abelha-ativa.service";

export const abelhaSelecionadaGuard: CanActivateFn = () => {
    const abelhaAtivaService = inject(AbelhaAtivaService);
    const router = inject(Router);

    if (abelhaAtivaService.abelhaAtivaId()) return true;

    router.navigateByUrl('/abelhas');
    return false;
};
```

- [ ] **Step 3: Verify it compiles**

Run: `pnpm exec tsc -p tsconfig.app.json --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/core/jogador/abelha-ativa.service.ts src/app/core/jogador/abelha-selecionada.guard.ts
git commit -m "feat: add AbelhaAtivaService and the abelha-selecionada route guard"
```

---

### Task 6: Formulário Criar Abelha

**Files:**
- Create: `src/app/abelhas/criar-abelha.component.ts`

**Interfaces:**
- Consumes: `JogadorService.criarJogador()`, `.criarAbelha()`, `.solicitando` (Task 2); `TamanhoAbelha` enum + `TITULO_TAMANHO_ABELHA` (existing, `core/models/aparencia/tamanhos.ts` + `core/constants/aparencia.ts`); `DialogComponent` (existing, `src/ui/dialog/`); `AbelhaComponent`/`bee-abelha` (existing, `src/ui/abelha/`).
- Produces: `CriarAbelhaComponent` (selector `app-criar-abelha`) with `open = model.required<boolean>()`, `precisaCriarJogador = input.required<boolean>()`, `criada = output<void>()`. Task 7 (`SelecaoAbelhaComponent`) embeds this directly.

- [ ] **Step 1: Create the component**

`src/app/abelhas/criar-abelha.component.ts`:
```ts
import { Component, inject, input, model, output, viewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { DialogComponent } from "../../ui/dialog/dialog.component";
import { FieldComponent } from "../../ui/field/field.component";
import { LabelComponent } from "../../ui/label/label.component";
import { InputComponent } from "../../ui/input/input.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { IndicatorComponent } from "../../ui/indicator/indicator.component";
import { Indication } from "../../ui/indicator/indication";
import { AbelhaComponent } from "../../ui/abelha/abelha.component";
import { JogadorService } from "../core/jogador/jogador.service";
import { TamanhoAbelha } from "../core/models/aparencia/tamanhos";
import { TITULO_TAMANHO_ABELHA } from "../core/constants/aparencia";

const TAMANHOS = Object.values(TamanhoAbelha);

@Component({
    selector: 'app-criar-abelha',
    template: `
    <bee-dialog [(open)]="open" title="Nova Abelha">
        <form class="flex flex-col gap-4 p-4" [formGroup]="form" (ngSubmit)="onSubmit()">
            @if (precisaCriarJogador()) {
                <bee-field>
                    <label bee-label for="input-nome-jogador">Seu nome</label>
                    <input type="text" bee-input id="input-nome-jogador" formControlName="nomeJogador" />
                </bee-field>

                <bee-field>
                    <label bee-label for="input-comida-favorita">Comida favorita</label>
                    <input type="text" bee-input id="input-comida-favorita" formControlName="comidaFavorita" />
                </bee-field>

                <hr>
            }

            <bee-field>
                <label bee-label for="input-nome-abelha">Nome da abelha</label>
                <input type="text" bee-input id="input-nome-abelha" formControlName="nomeAbelha" />
            </bee-field>

            <div class="grid grid-cols-2 gap-2">
                @for (tamanho of tamanhos; track tamanho) {
                    <button
                        type="button"
                        class="shadow-border border-2 bg-neutral-300 p-1.5 flex flex-col items-center gap-1 cursor-pointer"
                        [class.bg-primary!]="tamanho === form.controls.tamanho.value"
                        (click)="form.controls.tamanho.setValue(tamanho)"
                    >
                        <bee-abelha [tamanho]="tamanho" [scale]="1.3" />
                        <span class="text-xs text-center truncate w-full">{{ tituloTamanho[tamanho] }}</span>
                    </button>
                }
            </div>

            <bee-indicator class="w-full!" #indicator />

            <button fluid bee-button type="submit" [disabled]="form.invalid || jogadorService.solicitando()">
                Criar
            </button>
        </form>
    </bee-dialog>
    `,
    imports: [DialogComponent, ReactiveFormsModule, FieldComponent, LabelComponent, InputComponent, ButtonComponent, IndicatorComponent, AbelhaComponent]
})
export class CriarAbelhaComponent {
    protected readonly jogadorService = inject(JogadorService);
    private readonly formBuilder = inject(FormBuilder);

    readonly open = model.required<boolean>();
    readonly precisaCriarJogador = input.required<boolean>();
    readonly criada = output<void>();

    protected readonly tamanhos = TAMANHOS;
    protected readonly tituloTamanho = TITULO_TAMANHO_ABELHA;

    private readonly indicator = viewChild<IndicatorComponent>('indicator');

    protected readonly form = this.formBuilder.nonNullable.group({
        nomeJogador: [''],
        comidaFavorita: [''],
        nomeAbelha: ['', [Validators.required, Validators.maxLength(50)]],
        tamanho: [TamanhoAbelha.AltaGorda, Validators.required],
    });

    protected async onSubmit(): Promise<void> {
        if (this.precisaCriarJogador()) {
            this.form.controls.nomeJogador.addValidators(Validators.required);
            this.form.controls.comidaFavorita.addValidators(Validators.required);
            this.form.controls.nomeJogador.updateValueAndValidity();
            this.form.controls.comidaFavorita.updateValueAndValidity();
        }

        if (this.form.invalid) return;

        const valores = this.form.getRawValue();

        try {
            if (this.precisaCriarJogador()) {
                await this.jogadorService.criarJogador({
                    nome: valores.nomeJogador,
                    comidaFavorita: valores.comidaFavorita,
                    abelha: { nome: valores.nomeAbelha, tamanho: valores.tamanho },
                });
            } else {
                await this.jogadorService.criarAbelha({
                    nome: valores.nomeAbelha,
                    tamanho: valores.tamanho,
                });
            }

            this.form.reset({ nomeJogador: '', comidaFavorita: '', nomeAbelha: '', tamanho: TamanhoAbelha.AltaGorda });
            this.criada.emit();
        } catch (erro) {
            const mensagem = erro instanceof HttpErrorResponse
                ? (erro.error?.mensagem ?? 'Não foi possível criar a abelha.')
                : 'Não foi possível criar a abelha.';
            this.indicator()?.show(new Indication({ title: 'Ops!', message: mensagem, severity: 'danger', ttlInMs: 4000 }));
        }
    }
}
```

`nomeJogador`/`comidaFavorita` start without a `Validators.required` because the same form is reused for both cases (fields are hidden, not removed, when `precisaCriarJogador()` is false) — the validator is added right before submit only when those fields are actually visible and required, so an empty hidden field never blocks submission on a 2nd/3rd bee.

- [ ] **Step 2: Verify it compiles**

Run: `pnpm exec tsc -p tsconfig.app.json --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/abelhas/criar-abelha.component.ts
git commit -m "feat: add the bee-creation form (conditionally collects player info on the first bee)"
```

---

### Task 7: Tela de Seleção de Abelha

**Files:**
- Create: `src/app/abelhas/selecao-abelha.component.ts`
- Modify: `src/app/app.routes.ts`

**Interfaces:**
- Consumes: `JogadorService.jogador`, `.solicitando`, `.buscarPerfil()` (Task 2); `AbelhaAtivaService.selecionar()` (Task 5); `authGuard` (Task 1); `CriarAbelhaComponent` (Task 6); `AbelhaComponent`/`bee-abelha` (existing).
- Produces: `/abelhas` route.

- [ ] **Step 1: Create the component**

`src/app/abelhas/selecao-abelha.component.ts`:
```ts
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { JogadorService } from "../core/jogador/jogador.service";
import { AbelhaAtivaService } from "../core/jogador/abelha-ativa.service";
import { Abelha } from "../core/models/abelha/abelha";
import { AbelhaComponent } from "../../ui/abelha/abelha.component";
import { LoaderComponent } from "../../ui/loader/loader.component";
import { CenterComponent } from "../../ui/center/center.component";
import { TextComponent } from "../../ui/typography/text.component";
import { TamanhoAbelha } from "../core/models/aparencia/tamanhos";
import { CriarAbelhaComponent } from "./criar-abelha.component";

type Slot = { posicao: 'esquerda' | 'centro' | 'direita'; abelha: Abelha | null };

const POSICOES: Slot['posicao'][] = ['esquerda', 'centro', 'direita'];

@Component({
    selector: 'app-selecao-abelha',
    template: `
    @if (carregando()) {
        <bee-center class="h-dvh w-dvw pattern-background">
            <bee-loader [width]="32" />
        </bee-center>
    } @else {
        <div class="w-dvw h-dvh flex flex-row items-center justify-center gap-8 pattern-background">
            @for (slot of slots(); track slot.posicao) {
                <button
                    type="button"
                    class="shadow-border border-2 bg-neutral-300 w-56 h-72 flex flex-col items-center justify-center gap-3 cursor-pointer"
                    [class.h-80]="slot.posicao === 'centro'"
                    (click)="onSlotClick(slot)"
                >
                    @if (slot.abelha; as abelha) {
                        <bee-abelha [tamanho]="abelha.tamanho ?? tamanhoPadrao" [scale]="3" />
                        <bee-text class="font-bold">{{ abelha.nome }}</bee-text>
                    } @else {
                        <span class="text-8xl font-bold text-neutral-500 leading-none">+</span>
                        <bee-text>Nova Abelha</bee-text>
                    }
                </button>
            }
        </div>
    }

    <app-criar-abelha
        [(open)]="dialogoAberto"
        [precisaCriarJogador]="!jogador()"
        (criada)="recarregar()"
    />
    `,
    host: { class: 'block' },
    imports: [AbelhaComponent, LoaderComponent, CenterComponent, TextComponent, CriarAbelhaComponent]
})
export class SelecaoAbelhaComponent implements OnInit {
    private readonly jogadorService = inject(JogadorService);
    private readonly abelhaAtivaService = inject(AbelhaAtivaService);
    private readonly router = inject(Router);

    protected readonly tamanhoPadrao = TamanhoAbelha.AltaGorda;
    protected readonly dialogoAberto = signal(false);
    private readonly carregouUmaVez = signal(false);

    protected readonly jogador = this.jogadorService.jogador;
    protected readonly carregando = computed(() => !this.carregouUmaVez() && this.jogadorService.solicitando());

    protected readonly slots = computed<Slot[]>(() => {
        const abelhas = this.jogador()?.abelhas ?? [];
        return POSICOES.map((posicao, indice) => ({ posicao, abelha: abelhas[indice] ?? null }));
    });

    async ngOnInit(): Promise<void> {
        await this.jogadorService.buscarPerfil();
        this.carregouUmaVez.set(true);
    }

    protected onSlotClick(slot: Slot): void {
        if (slot.abelha) {
            this.abelhaAtivaService.selecionar(slot.abelha.id);
            this.router.navigateByUrl('/');
            return;
        }

        this.dialogoAberto.set(true);
    }

    protected async recarregar(): Promise<void> {
        this.dialogoAberto.set(false);
        await this.jogadorService.buscarPerfil();
    }
}
```

- [ ] **Step 2: Add the guarded route**

Modify `src/app/app.routes.ts`:
```ts
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
```

- [ ] **Step 3: Verify it compiles**

Run: `pnpm exec tsc -p tsconfig.app.json --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/abelhas/selecao-abelha.component.ts src/app/app.routes.ts
git commit -m "feat: add the 3-slot bee selection screen"
```

---

### Task 8: Game shell — extrair de App, ligar rota protegida

**Files:**
- Create: `src/app/game-shell/game-shell.component.ts`
- Modify: `src/app/app.ts`
- Modify: `src/app/app.routes.ts`

**Interfaces:**
- Consumes: `authGuard` (Task 1), `abelhaSelecionadaGuard` (Task 5); everything `App` already imported (`MapComponent`, the 6 challenge components, `DialogoComponent`, `DesafioAtualService`, `TipoDesafio`, `ConquistaProgressoService`, `DialogoGatilhoService`, `MusicaAmbienteService`) — all existing, unchanged.
- Produces: default route `''`, the last piece of the flow (`/cadastro` → `/login` → `/abelhas` → `''`).

- [ ] **Step 1: Create `GameShellComponent`**

`src/app/game-shell/game-shell.component.ts` — this is `App`'s current template and eager-injection logic, moved verbatim one directory level deeper (`./challenges/...` → `../challenges/...`, etc.), with the eager-injection comment updated to explain the new timing:
```ts
import { Component, inject } from "@angular/core";
import { DesafioCompleteTextoComponent } from "../challenges/complete-texto/complete-texto.component";
import { DesafioQuizComponent } from "../challenges/quiz/quiz.component";
import { DesafioEncontreParesComponent } from "../challenges/encontre-pares/encontre-pares.component";
import { DesafioEncontreBugComponent } from "../challenges/encontre-bug/encontre-bug.component";
import { DesafioCompleteCodigoComponent } from "../challenges/complete-codigo/complete-codigo.component";
import { DesafioLicaoComponent } from "../challenges/licao/licao.component";
import { MapComponent } from "../map/map.component";
import { DesafioAtualService } from "../core/services/desafio-atual.service";
import { TipoDesafio } from "../core/models/desafios/tipo-desafio";
import { ConquistaProgressoService } from "../core/services/conquista-progresso.service";
import { DialogoGatilhoService } from "../core/services/dialogo-gatilho.service";
import { MusicaAmbienteService } from "../core/services/musica-ambiente.service";
import { DialogoComponent } from "../dialogo/dialogo.component";

@Component({
  selector: 'app-game-shell',
  template: `
  <app-map />
  @if (desafioAtualService.tipoAtivo(); as tipo) {
    <div class="fixed inset-0 z-50">
      @switch (tipo) {
        @case (tipoDesafio.PerguntasRespostas) { <app-desafio-quiz /> }
        @case (tipoDesafio.EncontreBug) { <app-desafio-encontre-bug /> }
        @case (tipoDesafio.CompleteTexto) { <app-desafio-complete-texto /> }
        @case (tipoDesafio.CompleteCodigo) { <app-desafio-complete-codigo /> }
        @case (tipoDesafio.EncontrePares) { <app-desafio-encontre-pares /> }
        @case (tipoDesafio.Licao) { <app-desafio-licao /> }
      }
    </div>
  }
  <app-dialogo />
  `,
  imports: [DesafioCompleteTextoComponent, DesafioQuizComponent, DesafioEncontreParesComponent, DesafioEncontreBugComponent, DesafioCompleteCodigoComponent, DesafioLicaoComponent, MapComponent, DialogoComponent],
})
export class GameShellComponent {
  protected readonly desafioAtualService = inject(DesafioAtualService);
  protected readonly tipoDesafio = TipoDesafio;

  // Injetados só pra instanciar eagerly — os efeitos que observam conclusão de desafios,
  // reavaliam conquistas, disparam diálogos e tocam a trilha ambiente precisam começar
  // a rodar assim que o jogador entra na run. Antes rodavam desde o boot do App; agora
  // que existe login/seleção de abelha antes do jogo, o boot certo é aqui.
  private readonly conquistaProgressoService = inject(ConquistaProgressoService);
  private readonly dialogoGatilhoService = inject(DialogoGatilhoService);
  private readonly musicaAmbienteService = inject(MusicaAmbienteService);
}
```

- [ ] **Step 2: Strip `App` down to a router outlet**

Replace `src/app/app.ts` entirely with:
```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
  imports: [RouterOutlet],
})
export class App {}
```

- [ ] **Step 3: Add the default guarded route**

Modify `src/app/app.routes.ts` (final state):
```ts
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
```

- [ ] **Step 4: Verify it compiles**

Run: `pnpm exec tsc -p tsconfig.app.json --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/game-shell/ src/app/app.ts src/app/app.routes.ts
git commit -m "feat: route the app for real — cadastro/login/abelhas gate the game shell"
```

---

### Task 9: Verificação manual end-to-end

**Files:** none (verification only).

**Interfaces:** exercises the full stack built in Tasks 1–8.

- [ ] **Step 1: Start the backend**

In `../new-back`:
```bash
npm run start:dev
```
Expected: listening on `http://localhost:3000/api`. If CORS rejects the front's origin, set `CORS_ORIGIN=http://localhost:4200` in `../new-back`'s `.env` and restart.

- [ ] **Step 2: Start the frontend**

In this repo:
```bash
pnpm start
```
Expected: dev server on `http://localhost:4200`.

- [ ] **Step 3: Walk the full flow in a browser**

1. Visit `http://localhost:4200/` — expect a redirect to `/login` (no token yet).
2. Click "Cadastre-se", fill the form with a fresh email + a strong password, submit — expect it to log you in automatically and land on `/abelhas` with 3 empty "+" slots.
3. Click the center slot — the creation dialog should ask for your name, favorite food, bee name, and size (first bee ever). Submit — expect the dialog to close and the center slot to now show the bee.
4. Click that filled slot — expect navigation to `/` showing the existing map/game shell.
5. Navigate back to `/abelhas` directly, create a 2nd and 3rd bee (these should NOT ask for name/favorite food, only bee name/size) — expect all 3 slots filled.
6. Refresh the page while on `/` — expect a redirect back to `/abelhas` (no abelha ativa in memory after reload, per design).
7. Open browser dev tools → Network tab and confirm requests are going to `http://localhost:3000/api/...` with an `Authorization: Bearer ...` header, and that the 401 case works: manually clear `localStorage`'s `femabee_token` and refresh — expect a redirect to `/login`.

- [ ] **Step 4: Report results**

If every step above matches its expectation, the flow is done. If any step diverges, note exactly which step and what happened instead — do not mark this task complete until it does.
