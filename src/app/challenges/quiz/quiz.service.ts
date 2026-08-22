import { computed, Injectable, signal } from "@angular/core";
import { DesafioBaseService } from "../desafio-base.service";
import { Quiz } from "../../core/models/desafios/quiz/quiz";
import { PerguntaState } from "../../core/models/desafios/quiz/quiz-game";
import { Resposta } from "../../core/models/desafios/quiz/resposta";

export type FeedbackQuiz = 'correto' | 'incorreto' | undefined;

@Injectable({ providedIn: 'root' })
export class QuizService extends DesafioBaseService {
    private readonly _quiz = signal<Quiz | undefined>(undefined);
    private readonly _states = signal<PerguntaState[]>([]);
    private readonly _indice = signal<number>(0);

    // ── Leitura pública ────────────────────────────────────────────────────
    public readonly quiz = this._quiz.asReadonly();
    public readonly indice = this._indice.asReadonly();

    public readonly temJogo = computed(() => !!this._quiz());

    public readonly perguntaAtual = computed(() =>
        this._quiz()?.perguntas.at(this._indice())
    );

    public readonly respostasDisponiveis = computed(() =>
        this.perguntaAtual()?.repostas ?? []
    );

    public readonly stateAtual = computed(() => this._states().at(this._indice()));

    public readonly totalPerguntas = computed(() => this._quiz()?.perguntas.length ?? 0);

    /** Só considera o quiz concluído se todas as perguntas foram respondidas E todas corretas. */
    public readonly concluido = computed(() => {
        const states = this._states();
        return states.length > 0
            && states.every(s => s.concluido)
            && states.every(s => s.resultado === 'correto');
    });

    public readonly totalCorretas = computed(() =>
        this._states().filter(s => s.resultado === 'correto').length
    );

    public readonly totalIncorretas = computed(() =>
        this._states().filter(s => s.resultado === 'incorreto').length
    );

    // ── Ações ──────────────────────────────────────────────────────────────
    public init(quiz: Quiz): void {
        this._quiz.set(quiz);
        this._states.set(quiz.perguntas.map(() => new PerguntaState()));
        this._indice.set(0);
        this._progresso.set(0);
    }

    public clear(): void {
        this._quiz.set(undefined);
        this._states.set([]);
        this._indice.set(0);
        this._progresso.set(0);
    }

    /** Reinicia as respostas do mesmo quiz do zero — usado quando o jogador não acerta todas as perguntas. */
    public reiniciar(): void {
        const quiz = this._quiz();
        if (!quiz) return;
        this._states.set(quiz.perguntas.map(() => new PerguntaState()));
        this._indice.set(0);
        this._progresso.set(0);
    }

    /**
     * Valida a resposta escolhida pelo usuário para a pergunta atual.
     * Mock: compara localmente com `Pergunta.respostaCorreta`.
     * Substitua a lógica interna de `simularValidacao` por HttpClient quando disponível.
     */
    public async validarResposta(resposta: Resposta): Promise<FeedbackQuiz> {
        const indice = this._indice();
        const state = this._states().at(indice);
        const pergunta = this.perguntaAtual();
        if (!state || !pergunta || this._solicitando()) return undefined;

        const correto = pergunta.respostaCorreta?.id === resposta.id;
        const resultado = await this.simularValidacao<FeedbackQuiz>(correto ? 'correto' : 'incorreto');

        const novoState = state.comResposta(resposta, correto);
        this._states.update(states => states.map((s, i) => i === indice ? novoState : s));

        const total = this.totalPerguntas();
        const respondidas = this._states().filter(s => s.concluido).length;
        this._progresso.set(total ? (respondidas / total) * 100 : 0);

        return resultado;
    }

    /** Avança para a próxima pergunta — atualizar _indice dispara reatividade */
    public proxima(): void {
        const proximo = this._indice() + 1;
        if (proximo >= this.totalPerguntas()) return;
        this._indice.set(proximo);
    }

    /** Volta para a pergunta anterior */
    public voltar(): void {
        const anterior = this._indice() - 1;
        if (anterior < 0) return;
        this._indice.set(anterior);
    }
}
