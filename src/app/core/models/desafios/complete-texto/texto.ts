export type TextoProps = {
    id: string;
    /** Template com marcadores {{1}}, {{2}}, ... para as lacunas */
    texto: string;
    /** Opções embaralhadas que o usuário pode escolher */
    opcoes: string[];
    /** Respostas corretas para cada lacuna, na ordem: respostas[0] → {{1}}, etc. */
    respostas: string[];
}

export class Texto {
    constructor(private props: TextoProps) {}

    get id()        { return this.props.id; }
    get texto()     { return this.props.texto; }
    get opcoes()    { return this.props.opcoes; }
    get respostas() { return this.props.respostas; }

    /** Quantidade de lacunas no texto */
    get totalLacunas(): number {
        return (this.props.texto.match(/\{\{\d+\}\}/g) ?? []).length;
    }

    /** Valida se o array de opções selecionadas corresponde às respostas corretas */
    public validar(opcoesSelecionadas: string[]): boolean {
        if (opcoesSelecionadas.length !== this.respostas.length) return false;
        return opcoesSelecionadas.every((op, i) => op === this.respostas[i]);
    }
}