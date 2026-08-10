import { Resposta } from "./resposta";

export type ResultadoPergunta = 'correto' | 'incorreto';

export class PerguntaState {
    constructor(
        public readonly respostaSelecionada: Resposta | undefined = undefined,
        public readonly resultado: ResultadoPergunta | undefined = undefined,
    ) {}

    get concluido(): boolean {
        return this.resultado !== undefined;
    }

    /** Retorna um novo estado com a resposta registrada — nunca muta a instância atual */
    public comResposta(resposta: Resposta, correto: boolean): PerguntaState {
        return new PerguntaState(resposta, correto ? 'correto' : 'incorreto');
    }
}
