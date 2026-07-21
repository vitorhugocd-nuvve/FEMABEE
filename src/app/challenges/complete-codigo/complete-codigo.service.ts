import { computed, Injectable, signal } from "@angular/core";
import { DesafioBaseService } from "../desafio-base.service";
import { CompleteCodigo } from "../../core/models/desafios/complete-codigo/complete-codigo";
import { CodigoIncompletoState } from "../../core/models/desafios/complete-codigo/codigo-incompleto-state";

export type FeedbackCompleteCodigo = 'correto' | 'incorreto' | undefined;

@Injectable({ providedIn: 'root' })
export class CompleteCodigoService extends DesafioBaseService {
    private readonly _desafio  = signal<CompleteCodigo | undefined>(undefined);
    private readonly _states   = signal<CodigoIncompletoState[]>([]);
    private readonly _feedback = signal<FeedbackCompleteCodigo>(undefined);

    public readonly desafio  = this._desafio.asReadonly();
    public readonly feedback = this._feedback.asReadonly();

    public readonly stateAtual = computed(() => {
        const d = this._desafio();
        if (!d) return undefined;
        return this._states().at(d.indice);
    });

    public readonly podeAvancar = computed(() => this._desafio()?.podeAvancar ?? false);
    public readonly podeVoltar  = computed(() => this._desafio()?.podeVoltar  ?? false);

    /** Concluído = não há mais códigos à frente e o código atual já foi resolvido corretamente */
    public readonly concluido = computed(() => {
        if (!this._desafio()) return false;
        return !this.podeAvancar() && (this.stateAtual()?.concluido ?? false);
    });

    public readonly totalCodigos = computed(() => this._states().length);

    public readonly totalCorretos = computed(() =>
        this._states().filter(s => s.concluido).length
    );

    public iniciar(desafio: CompleteCodigo): void {
        this._states.set(desafio.codigos.map(c => new CodigoIncompletoState(c)));
        this._desafio.set(desafio);
        this._feedback.set(undefined);
        this._progresso.set(0);
    }

    public encerrar(): void {
        this._desafio.set(undefined);
        this._states.set([]);
        this._feedback.set(undefined);
        this._progresso.set(0);
    }

    public avancar(): void {
        const atual = this._desafio();
        if (!atual) return;
        this._desafio.set(atual.avancar());
        this._feedback.set(undefined);
    }

    public voltar(): void {
        const atual = this._desafio();
        if (!atual) return;
        this._desafio.set(atual.voltar());
        this._feedback.set(undefined);
    }

    /** Seleciona (ou desmarca) o trecho candidato para a lacuna, sem validar ainda */
    public selecionar(trechoId: string | undefined): void {
        const state = this.stateAtual();
        if (!state || state.concluido) return;
        const novoState = state.comSelecao(trechoId);
        this._states.update(states => states.map(s => s === state ? novoState : s));
    }

    /**
     * Valida o trecho selecionado para a lacuna atual.
     * Mock: compara localmente com `CodigoIncompleto.respostaCorreta`.
     * Substitua a lógica interna de `simularValidacao` por HttpClient quando disponível.
     */
    public async validar(): Promise<FeedbackCompleteCodigo> {
        const state = this.stateAtual();
        if (!state || !state.trechoSelecionadoId || this._solicitando()) return undefined;

        const correto = state.codigo.validar(state.trechoSelecionadoId);
        const resultado = await this.simularValidacao<FeedbackCompleteCodigo>(correto ? 'correto' : 'incorreto');

        if (correto) {
            const novoState = state.comConcluido();
            this._states.update(states => states.map(s => s === state ? novoState : s));

            const total = this.totalCodigos();
            const concluidos = this._states().filter(s => s.concluido).length;
            this._progresso.set(total ? (concluidos / total) * 100 : 0);
        }

        this._feedback.set(resultado);
        return resultado;
    }

    public limparFeedback(): void {
        this._feedback.set(undefined);
    }
}
