import { Quiz } from "./quiz";
import { Resposta } from "./resposta";

export type ResultadoPergunta = 'correto' | 'incorreto' | 'pendente';

export interface PerguntaState {
    respostaSelecionada: Resposta | undefined;
    resultado: ResultadoPergunta;
}

export class QuizGame {
    public states: PerguntaState[];

    constructor(public quiz: Quiz) {
        this.states = quiz.perguntas.map(() => ({
            respostaSelecionada: undefined,
            resultado: 'pendente' as ResultadoPergunta
        }));
    }

    public numeroPergunta(indice: number): number {
        return indice + 1;
    }

    public porcentagemConclusao(): number {
        const respondidas = this.states.filter(s => s.resultado !== 'pendente').length;
        return (respondidas / this.quiz.perguntas.length) * 100;
    }

    public pergunta(indice: number) {
        return this.quiz.perguntas.at(indice);
    }

    public respostas(indice: number) {
        return this.pergunta(indice)?.repostas;
    }

    public state(indice: number): PerguntaState | undefined {
        return this.states.at(indice);
    }

    /**
     * Valida a resposta para o índice fornecido.
     * Compara com a resposta marcada como `correta: true` na pergunta.
     */
    public validar(resposta: Resposta, indice: number): 'correto' | 'incorreto' {
        const state = this.states.at(indice);
        if (!state) return 'incorreto';
        const pergunta = this.pergunta(indice);
        const correto = pergunta?.respostaCorreta?.id === resposta.id;
        state.respostaSelecionada = resposta;
        state.resultado = correto ? 'correto' : 'incorreto';
        return state.resultado;
    }

    get totalCorretas(): number {
        return this.states.filter(s => s.resultado === 'correto').length;
    }

    get totalIncorretas(): number {
        return this.states.filter(s => s.resultado === 'incorreto').length;
    }

    get concluido(): boolean {
        return this.states.every(s => s.resultado !== 'pendente');
    }
}