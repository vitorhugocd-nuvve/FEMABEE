import { Desafio, DesafioProps } from "../desafio";
import { Dificuldade } from "../dificuldade";
import { TipoDesafio } from "../tipo-desafio";
import { Pergunta } from "./pergunta";

export type QuizProps = {
    perguntas: Pergunta[];
} & DesafioProps

export class Quiz implements Desafio {
    constructor(private props: QuizProps) { }

    get dificuldade(): Dificuldade { return this.props.dificuldade; }
    get grupo(): string { return this.props.grupo; }
    get id(): string { return this.props.id; }
    get nivel(): number { return this.props.nivel; }
    get tipo(): TipoDesafio { return this.props.tipo; }
    get perguntas(): Pergunta[] { return this.props.perguntas; }
    get padrao() { return this.props.padrao; }
}