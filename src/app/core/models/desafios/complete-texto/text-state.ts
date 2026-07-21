import { Texto } from "./texto";

export type ResultadoTexto = 'correto' | 'incorreto';

export class TextoState {
    public opcoesSelecionadas: string[] = [];
    public resultado: ResultadoTexto | undefined = undefined;

    constructor(public readonly texto: Texto) {}

    get concluido(): boolean {
        return this.resultado !== undefined;
    }

    public marcarComo(opcoes: string[], correto: boolean) {
        this.opcoesSelecionadas = opcoes;
        this.resultado = correto ? 'correto' : 'incorreto';
    }

    public reset() {
        this.opcoesSelecionadas = [];
        this.resultado = undefined;
    }
}