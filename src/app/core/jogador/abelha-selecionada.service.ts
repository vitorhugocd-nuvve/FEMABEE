import { Injectable, signal } from "@angular/core";
import { Abelha } from "../models/abelha/abelha";

/**
 * Qual abelha (run) está ativa agora — só em memória, de propósito: um reload
 * volta pra tela de seleção em vez de reabrir uma run "esquecida", evitando
 * estado obsoleto (ex.: abelha removida em outra aba). Guarda a abelha inteira
 * (não só o id) pra qualquer tela do jogo exibir nome/tamanho sem precisar
 * cruzar com JogadorService.jogador() de novo.
 */
@Injectable({ providedIn: 'root' })
export class AbelhaSelecionadaService {
    private readonly _abelha = signal<Abelha | null>(null);

    readonly abelha = this._abelha.asReadonly();

    selecionar(abelha: Abelha): void {
        console.log(`[ABELHA-SELECIONADA] selecionar("${abelha.nome}", id="${abelha.id}")`);
        this._abelha.set(abelha);
    }

    limpar(): void {
        console.log('[ABELHA-SELECIONADA] limpar()');
        this._abelha.set(null);
    }
}
