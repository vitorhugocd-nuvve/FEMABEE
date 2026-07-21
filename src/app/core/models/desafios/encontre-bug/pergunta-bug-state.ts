import { PerguntaBug } from "./pergunta-bug";

export type ResultadoPerguntaBug = 'correto' | 'incorreto';

export class PerguntaBugState {
    constructor(
        public readonly pergunta: PerguntaBug,
        public readonly respostaSelecionadaId: string | undefined = undefined,
        public readonly resultado: ResultadoPerguntaBug | undefined = undefined,
    ) {}

    get concluido(): boolean {
        return this.resultado !== undefined;
    }

    /** Retorna um novo estado com a resposta registrada — nunca muta a instância atual */
    public comResposta(respostaId: string, correto: boolean): PerguntaBugState {
        return new PerguntaBugState(this.pergunta, respostaId, correto ? 'correto' : 'incorreto');
    }
}
