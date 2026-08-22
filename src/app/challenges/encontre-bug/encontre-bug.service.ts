import { computed, Injectable, signal } from "@angular/core";
import { DesafioBaseService } from "../desafio-base.service";
import { EncontreBug } from "../../core/models/desafios/encontre-bug/encontre-bug";
import { PerguntaBugState } from "../../core/models/desafios/encontre-bug/pergunta-bug-state";

export type FeedbackEncontreBug = 'correto' | 'incorreto' | undefined;

@Injectable({ providedIn: 'root' })
export class EncontreBugService extends DesafioBaseService {
    private readonly _desafio = signal<EncontreBug | undefined>(undefined);
    private readonly _states  = signal<PerguntaBugState[]>([]);

    /** Referência ao desafio no índice inicial — permite `reiniciar()` voltar do zero. */
    private desafioOriginal: EncontreBug | undefined;

    public readonly desafio = this._desafio.asReadonly();

    public readonly stateAtual = computed(() => {
        const d = this._desafio();
        if (!d) return undefined;
        return this._states().at(d.indice);
    });

    public readonly podeAvancar = computed(() => this._desafio()?.podeAvancar ?? false);
    public readonly podeVoltar  = computed(() => this._desafio()?.podeVoltar  ?? false);

    /** Concluído = todas as perguntas foram respondidas E todas corretas. */
    public readonly concluido = computed(() => {
        const states = this._states();
        return states.length > 0
            && !this.podeAvancar()
            && states.every(s => s.concluido)
            && states.every(s => s.resultado === 'correto');
    });

    public readonly totalPerguntas = computed(() => this._states().length);

    public readonly totalCorretas = computed(() =>
        this._states().filter(s => s.resultado === 'correto').length
    );

    public iniciar(desafio: EncontreBug): void {
        this.desafioOriginal = desafio;
        this._states.set(desafio.perguntas.map(p => new PerguntaBugState(p)));
        this._desafio.set(desafio);
        this._progresso.set(0);
    }

    /** Reinicia as respostas do mesmo desafio do zero — usado quando o jogador não acerta todas as perguntas. */
    public reiniciar(): void {
        if (!this.desafioOriginal) return;
        this.iniciar(this.desafioOriginal);
    }

    public encerrar(): void {
        this._desafio.set(undefined);
        this._states.set([]);
        this._progresso.set(0);
    }

    public avancar(): void {
        const atual = this._desafio();
        if (!atual) return;
        this._desafio.set(atual.avancar());
    }

    public voltar(): void {
        const atual = this._desafio();
        if (!atual) return;
        this._desafio.set(atual.voltar());
    }

    /**
     * Valida a resposta escolhida pelo usuário para a pergunta atual.
     * Mock: compara localmente com `PerguntaBug.respostaCorreta`.
     * Substitua a lógica interna de `simularValidacao` por HttpClient quando disponível.
     */
    public async responder(respostaId: string): Promise<FeedbackEncontreBug> {
        const state = this.stateAtual();
        if (!state || this._solicitando()) return undefined;

        const correto = state.pergunta.validar(respostaId);
        const resultado = await this.simularValidacao<FeedbackEncontreBug>(correto ? 'correto' : 'incorreto');

        const novoState = state.comResposta(respostaId, correto);
        this._states.update(states => states.map(s => s === state ? novoState : s));

        const total = this.totalPerguntas();
        const respondidas = this._states().filter(s => s.concluido).length;
        this._progresso.set(total ? (respondidas / total) * 100 : 0);

        return resultado;
    }
}
