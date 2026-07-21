import { CodigoIncompleto } from "./codigo-incompleto";

export class CodigoIncompletoState {
    constructor(
        public readonly codigo: CodigoIncompleto,
        public readonly trechoSelecionadoId: string | undefined = undefined,
        public readonly concluido: boolean = false,
    ) {}

    /** Retorna um novo estado com a seleção atualizada — nunca muta a instância atual */
    public comSelecao(trechoId: string | undefined): CodigoIncompletoState {
        return new CodigoIncompletoState(this.codigo, trechoId, this.concluido);
    }

    /** Retorna um novo estado marcado como concluído (resposta correta confirmada) */
    public comConcluido(): CodigoIncompletoState {
        return new CodigoIncompletoState(this.codigo, this.trechoSelecionadoId, true);
    }
}
