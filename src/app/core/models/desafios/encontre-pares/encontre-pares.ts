import { Desafio } from "../desafio";
import { Dificuldade } from "../dificuldade";
import { TipoDesafio } from "../tipo-desafio";
import { Rodada } from "./rodada";

export type EncontreParesProps = {
    id: string;
    rodadas: Rodada[];
    dificuldade: Dificuldade;
    nivel: number;
    grupo: string;
    padrao: string;
}

export class EncontrePares implements Desafio {
    constructor(
        private props: EncontreParesProps,
        private readonly indiceAtual: number = 0,
    ) {}

    get id() { return this.props.id; }
    get rodadas(): Rodada[] { return this.props.rodadas; }
    get dificuldade(): Dificuldade { return this.props.dificuldade; }
    get grupo(): string { return this.props.grupo; }
    get padrao(): string { return this.props.padrao; }
    get nivel(): number { return this.props.nivel; }
    get tipo(): TipoDesafio { return TipoDesafio.EncontrePares; }

    get rodadaAtual(): Rodada | undefined {
        return this.rodadas.at(this.indiceAtual);
    }

    get indice(): number { return this.indiceAtual; }

    get podeAvancar(): boolean {
        return this.indiceAtual < this.rodadas.length - 1;
    }

    get podeVoltar(): boolean {
        return this.indiceAtual > 0;
    }

    /** Retorna uma nova instância apontando para a próxima rodada — nunca muta a atual */
    public avancar(): EncontrePares {
        return this.podeAvancar ? new EncontrePares(this.props, this.indiceAtual + 1) : this;
    }

    public voltar(): EncontrePares {
        return this.podeVoltar ? new EncontrePares(this.props, this.indiceAtual - 1) : this;
    }
}
