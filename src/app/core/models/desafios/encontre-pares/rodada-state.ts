import { Rodada } from "./rodada";

export class RodadaState {
    constructor(
        public readonly rodada: Rodada,
        private readonly resolvidos: ReadonlySet<string> = new Set(),
    ) {}

    get totalResolvidos(): number { return this.resolvidos.size; }

    get concluido(): boolean {
        return this.resolvidos.size === this.rodada.totalPares;
    }

    public foiResolvido(parId: string): boolean {
        return this.resolvidos.has(parId);
    }

    /** Retorna um novo estado com o par marcado como resolvido — nunca muta a instância atual */
    public comParResolvido(parId: string): RodadaState {
        return new RodadaState(this.rodada, new Set([...this.resolvidos, parId]));
    }
}
