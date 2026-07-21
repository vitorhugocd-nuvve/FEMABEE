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

    public readonly desafio    = this._desafio.asReadonly();
    public readonly feedback   = this._feedback.asReadonly();

    public readonly stateAtual = computed(() => {
        const d = this._desafio();
        if (!d) return undefined;
        return this._states().at(d.indice);
    });

    public readonly podeAvancar = computed(() => this._desafio()?.podeAvancar ?? false);
    public readonly podeVoltar  = computed(() => this._desafio()?.podeVoltar  ?? false);
    public readonly concluido   = computed(() => this._desafio()?.concluido   ?? false);

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
        this._states.set(desafio.textos.map(t => new TextoState(t)));
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
        this._desafio()?.avancar();
        this._feedback.set(undefined);
        this._desafio.update(d => d); // força reatividade
    }

    public voltar(): void {
        this._desafio()?.voltar();
        this._feedback.set(undefined);
        this._desafio.update(d => d);
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

        state.marcarComo(opcoesSelecionadas, correto);
        this._feedback.set(resultado);
        this._progresso.set(this.progressoReal());
        this._states.update(s => [...s]); // força reatividade
        return resultado;
    }

    public limparFeedback(): void {
        this._feedback.set(undefined);
    }
}