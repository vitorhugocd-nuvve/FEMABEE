import { Desafio } from "../desafio";
import { Dificuldade } from "../dificuldade";
import { TipoDesafio } from "../tipo-desafio";

export type LicaoProps = {
    id: string;
    dificuldade: Dificuldade;
    nivel: number;
    grupo: string;
    padrao: string;
    /** Conteúdo em Markdown: texto, imagens (`![]()`), código (fences ```lang) e UML (fences ```mermaid). */
    conteudoMarkdown: string;
}

export class Licao implements Desafio {
    constructor(private props: LicaoProps) { }

    get id() { return this.props.id; }
    get dificuldade(): Dificuldade { return this.props.dificuldade; }
    get grupo(): string { return this.props.grupo; }
    get padrao(): string { return this.props.padrao; }
    get nivel(): number { return this.props.nivel; }
    get tipo(): TipoDesafio { return TipoDesafio.Licao; }
    get conteudoMarkdown(): string { return this.props.conteudoMarkdown; }
}
