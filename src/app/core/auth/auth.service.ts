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

export interface UsuarioLogado {
    email: string;
    nomeDeUsuario: string;
}

/** Decodifica o payload de um JWT (sem verificar assinatura — o backend já validou ao emitir). */
function decodificarPayloadJwt(token: string): UsuarioLogado | null {
    try {
        const [, payloadBase64] = token.split('.');
        const payloadJson = decodeURIComponent(
            atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
                .split('')
                .map(caractere => '%' + caractere.charCodeAt(0).toString(16).padStart(2, '0'))
                .join(''),
        );
        return JSON.parse(payloadJson);
    } catch {
        return null;
    }
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

    /** Dados do usuário logado direto do token (email, nome de usuário) — evita pedir de novo no resto do app. */
    readonly usuarioLogado = computed<UsuarioLogado | null>(() => {
        const token = this._token();
        return token ? decodificarPayloadJwt(token) : null;
    });

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
