import { Desafio } from "../desafio";
import { Dificuldade } from "../dificuldade";
import { TipoDesafio } from "../tipo-desafio";
import { CodigoIncompleto } from "./codigo-incompleto";

export type CompleteCodigoProps = {
    id: string;
    codigos: CodigoIncompleto[];
    dificuldade: Dificuldade;
    nivel: number;
    grupo: string;
    padrao: string;
}

export class CompleteCodigo implements Desafio {
    constructor(
        private props: CompleteCodigoProps,
        private readonly indiceAtual: number = 0,
    ) {}

    get id() { return this.props.id; }
    get codigos(): CodigoIncompleto[] { return this.props.codigos; }
    get dificuldade(): Dificuldade { return this.props.dificuldade; }
    get grupo(): string { return this.props.grupo; }
    get padrao(): string { return this.props.padrao; }
    get nivel(): number { return this.props.nivel; }
    get tipo(): TipoDesafio { return TipoDesafio.CompleteCodigo; }

    get codigoAtual(): CodigoIncompleto | undefined {
        return this.codigos.at(this.indiceAtual);
    }

    get indice(): number { return this.indiceAtual; }

    get podeAvancar(): boolean {
        return this.indiceAtual < this.codigos.length - 1;
    }

    get podeVoltar(): boolean {
        return this.indiceAtual > 0;
    }

    /** Retorna uma nova instância apontando para o próximo código — nunca muta a atual */
    public avancar(): CompleteCodigo {
        return this.podeAvancar ? new CompleteCodigo(this.props, this.indiceAtual + 1) : this;
    }

    public voltar(): CompleteCodigo {
        return this.podeVoltar ? new CompleteCodigo(this.props, this.indiceAtual - 1) : this;
    }
}
