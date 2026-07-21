import { Desafio } from "../desafio";
import { Dificuldade } from "../dificuldade";
import { TipoDesafio } from "../tipo-desafio";
import { PerguntaBug } from "./pergunta-bug";

export type EncontreBugProps = {
    id: string;
    perguntas: PerguntaBug[];
    dificuldade: Dificuldade;
    nivel: number;
    grupo: string;
    padrao: string;
}

export class EncontreBug implements Desafio {
    constructor(
        private props: EncontreBugProps,
        private readonly indiceAtual: number = 0,
    ) {}

    get id() { return this.props.id; }
    get perguntas(): PerguntaBug[] { return this.props.perguntas; }
    get dificuldade(): Dificuldade { return this.props.dificuldade; }
    get grupo(): string { return this.props.grupo; }
    get padrao(): string { return this.props.padrao; }
    get nivel(): number { return this.props.nivel; }
    get tipo(): TipoDesafio { return TipoDesafio.EncontreBug; }

    get perguntaAtual(): PerguntaBug | undefined {
        return this.perguntas.at(this.indiceAtual);
    }

    get indice(): number { return this.indiceAtual; }

    get podeAvancar(): boolean {
        return this.indiceAtual < this.perguntas.length - 1;
    }

    get podeVoltar(): boolean {
        return this.indiceAtual > 0;
    }

    /** Retorna uma nova instância apontando para a próxima pergunta — nunca muta a atual */
    public avancar(): EncontreBug {
        return this.podeAvancar ? new EncontreBug(this.props, this.indiceAtual + 1) : this;
    }

    public voltar(): EncontreBug {
        return this.podeVoltar ? new EncontreBug(this.props, this.indiceAtual - 1) : this;
    }
}
