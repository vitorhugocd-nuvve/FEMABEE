import { Injectable, signal, computed } from "@angular/core";
import { DesafioBaseService } from "../desafio-base.service";
import { CompleteTexto } from "../../core/models/desafios/complete-texto/complete-texto";
import { TextoState } from "../../core/models/desafios/complete-texto/text-state";

export type FeedbackCompleteTexto = 'correto' | 'incorreto' | undefined;

@Injectable({ providedIn: 'root' })
export class CompleteTextoService extends DesafioBaseService {
    private readonly _desafio = signal<CompleteTexto | undefined>(undefined);
    private readonly _states  = signal<TextoState[]>([]);
    private readonly _feedback = signal<FeedbackCompleteTexto>(undefined);

    /** Referência ao desafio no índice inicial — permite `reiniciar()` voltar do zero. */
    private desafioOriginal: CompleteTexto | undefined;

    public readonly desafio    = this._desafio.asReadonly();
    public readonly feedback   = this._feedback.asReadonly();

    public readonly stateAtual = computed(() => {
        const d = this._desafio();
        if (!d) return undefined;
        return this._states().at(d.indice);
    });

    public readonly podeAvancar = computed(() => this._desafio()?.podeAvancar ?? false);
    public readonly podeVoltar  = computed(() => this._desafio()?.podeVoltar  ?? false);

    /** Concluído = todos os textos foram respondidos E todos corretos. */
    public readonly concluido = computed(() => {
        const states = this._states();
        return states.length > 0
            && !this.podeAvancar()
            && states.every(s => s.concluido)
            && states.every(s => s.resultado === 'correto');
    });

    public readonly progressoReal = computed(() => {
        const states = this._states();
        if (!states.length) return 0;
        const respondidas = states.filter(s => s.concluido).length;
        return (respondidas / states.length) * 100;
    });

    public readonly totalCorretas = computed(() =>
        this._states().filter(s => s.resultado === 'correto').length
    );

    public readonly totalTextos = computed(() => this._states().length);

    public iniciar(desafio: CompleteTexto): void {
        this.desafioOriginal = desafio;
        this._states.set(desafio.textos.map(t => new TextoState(t)));
        this._desafio.set(desafio);
        this._feedback.set(undefined);
        this._progresso.set(0);
    }

    /** Reinicia as respostas do mesmo desafio do zero — usado quando o jogador não acerta todos os textos. */
    public reiniciar(): void {
        if (!this.desafioOriginal) return;
        this.iniciar(this.desafioOriginal);
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

    /**
     * Valida as opções selecionadas pelo usuário para o texto atual.
     * Mock: compara localmente com `texto.respostas`.
     * Substitua a lógica interna de `simularValidacao` por HttpClient quando disponível.
     */
    public async validar(opcoesSelecionadas: string[]): Promise<FeedbackCompleteTexto> {
        const state = this.stateAtual();
        if (!state || this._solicitando()) return undefined;

        // validação mock local
        const correto = state.texto.validar(opcoesSelecionadas);

        const resultado = await this.simularValidacao<FeedbackCompleteTexto>(
            correto ? 'correto' : 'incorreto'
        );

        const novoState = state.comResultado(opcoesSelecionadas, correto);
        this._states.update(states => states.map(s => s === state ? novoState : s));

        this._feedback.set(resultado);
        this._progresso.set(this.progressoReal());
        return resultado;
    }

    public limparFeedback(): void {
        this._feedback.set(undefined);
    }
}
