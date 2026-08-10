import { Texto } from "./texto";

export type ResultadoTexto = 'correto' | 'incorreto';

export class TextoState {
    constructor(
        public readonly texto: Texto,
        public readonly opcoesSelecionadas: string[] = [],
        public readonly resultado: ResultadoTexto | undefined = undefined,
    ) {}

    get concluido(): boolean {
        return this.resultado !== undefined;
    }

    /** Retorna um novo estado com o resultado registrado — nunca muta a instância atual */
    public comResultado(opcoes: string[], correto: boolean): TextoState {
        return new TextoState(this.texto, opcoes, correto ? 'correto' : 'incorreto');
    }
}
