import { Resposta } from "./resposta";

export type PerguntaProps = {
    id: string;
    texto: string;
    repostas: Resposta[];
}

export class Pergunta {

    constructor (private props: PerguntaProps) {}

    get id()       { return this.props.id; }
    get texto()    { return this.props.texto; }
    get repostas() { return this.props.repostas; }

    /** Retorna a resposta marcada como correta, se existir */
    get respostaCorreta(): Resposta | undefined {
        return this.props.repostas.find(r => r.correta);
    }
}