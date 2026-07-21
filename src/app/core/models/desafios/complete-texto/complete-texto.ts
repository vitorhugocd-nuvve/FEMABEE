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
    private indiceAtual = 0;

    constructor(private props: CompleteTextoProps) {}

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

    get concluido(): boolean {
        return this.indiceAtual >= this.textos.length;
    }

    public avancar(): void {
        if (this.podeAvancar) this.indiceAtual++;
    }

    public voltar(): void {
        if (this.podeVoltar) this.indiceAtual--;
    }

    public reset(): void {
        this.indiceAtual = 0;
    }
}