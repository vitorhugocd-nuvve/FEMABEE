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
    abelha: { nome: string; tamanho?: TamanhoAbelha; comidaFavorita: string };
}

export interface CriarAbelhaPayload {
    nome: string;
    tamanho?: TamanhoAbelha;
    comidaFavorita: string;
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

    /** O backend recusa remover a última abelha do jogador (400) — deixa o erro propagar pra quem chamou tratar. */
    async removerAbelha(idAbelha: string): Promise<void> {
        await firstValueFrom(
            this.http.delete<RespostaApi<undefined>>(`${API_BASE_URL}/jogador/abelhas/${idAbelha}`),
        );
        await this.buscarPerfil();
    }
}
