import { Desafio } from "../desafio";
import { Dificuldade } from "../dificuldade";
import { TipoDesafio } from "../tipo-desafio";
import { Texto } from "./texto";

export type CompleteTextoProps = {
    id: string;
    textos: Texto[];
    dificuldade: Dificuldade;
    nivel: number;
    grupo: string;
    padrao: string;
}

export class CompleteTexto implements Desafio {
    constructor(
        private props: CompleteTextoProps,
        private readonly indiceAtual: number = 0,
    ) {}

    get id() { return this.props.id; }
    get textos(): Texto[] { return this.props.textos; }
    get dificuldade(): Dificuldade { return this.props.dificuldade; }
    get grupo(): string { return this.props.grupo; }
    get padrao(): string { return this.props.padrao; }
    get nivel(): number { return this.props.nivel; }
    get tipo(): TipoDesafio { return TipoDesafio.CompleteTexto; }

    get textoAtual(): Texto | undefined {
        return this.textos.at(this.indiceAtual);
    }

    get indice(): number { return this.indiceAtual; }

    get podeAvancar(): boolean {
        return this.indiceAtual < this.textos.length - 1;
    }

    get podeVoltar(): boolean {
        return this.indiceAtual > 0;
    }

    /** Retorna uma nova instância apontando para o próximo texto — nunca muta a atual */
    public avancar(): CompleteTexto {
        return this.podeAvancar ? new CompleteTexto(this.props, this.indiceAtual + 1) : this;
    }

    public voltar(): CompleteTexto {
        return this.podeVoltar ? new CompleteTexto(this.props, this.indiceAtual - 1) : this;
    }
}
