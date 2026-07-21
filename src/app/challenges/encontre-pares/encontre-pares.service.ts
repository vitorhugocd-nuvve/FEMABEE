import { computed, Injectable, signal } from "@angular/core";
import { DesafioBaseService } from "../desafio-base.service";
import { EncontrePares } from "../../core/models/desafios/encontre-pares/encontre-pares";
import { RodadaState } from "../../core/models/desafios/encontre-pares/rodada-state";

export type FeedbackEncontrePares = 'correto' | 'incorreto' | undefined;

@Injectable({ providedIn: 'root' })
export class EncontreParesService extends DesafioBaseService {
    private readonly _desafio  = signal<EncontrePares | undefined>(undefined);
    private readonly _states   = signal<RodadaState[]>([]);
    private readonly _feedback = signal<FeedbackEncontrePares>(undefined);

    public readonly desafio  = this._desafio.asReadonly();
    public readonly feedback = this._feedback.asReadonly();

    public readonly stateAtual = computed(() => {
        const d = this._desafio();
        if (!d) return undefined;
        return this._states().at(d.indice);
    });

    public readonly podeAvancar = computed(() => this._desafio()?.podeAvancar ?? false);
    public readonly podeVoltar  = computed(() => this._desafio()?.podeVoltar  ?? false);

    /** Concluído = não há mais rodadas à frente e a rodada atual já teve todos os pares casados */
    public readonly concluido = computed(() => {
        if (!this._desafio()) return false;
        return !this.podeAvancar() && (this.stateAtual()?.concluido ?? false);
    });

    public readonly totalRodadas = computed(() => this._states().length);

    public readonly progressoReal = computed(() => {
        const states = this._states();
        const totalPares = states.reduce((acc, s) => acc + s.rodada.totalPares, 0);
        if (!totalPares) return 0;
        const resolvidos = states.reduce((acc, s) => acc + s.totalResolvidos, 0);
        return (resolvidos / totalPares) * 100;
    });

    public iniciar(desafio: EncontrePares): void {
        this._states.set(desafio.rodadas.map(r => new RodadaState(r)));
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

    /**
     * Confirma uma tentativa de combinação entre uma afirmação e uma correspondência.
     * Mock: o par é correto quando os dois lados compartilham o mesmo `Par.id`.
     * Substitua a lógica interna de `simularValidacao` por HttpClient quando disponível.
     */
    public async confirmarPar(parIdAfirmacao: string, parIdCorrespondencia: string): Promise<FeedbackEncontrePares> {
        const state = this.stateAtual();
        if (!state || this._solicitando()) return undefined;

        const correto = parIdAfirmacao === parIdCorrespondencia;
        const resultado = await this.simularValidacao<FeedbackEncontrePares>(correto ? 'correto' : 'incorreto', 300);

        if (resultado === 'correto') {
            const novoState = state.comParResolvido(parIdAfirmacao);
            this._states.update(states => states.map(s => s === state ? novoState : s));
            this._progresso.set(this.progressoReal());
        }

        this._feedback.set(resultado);
        return resultado;
    }

    public limparFeedback(): void {
        this._feedback.set(undefined);
    }
}
