import { computed, Injectable, signal } from "@angular/core";
import { DesafioBaseService } from "../desafio-base.service";
import { Quiz } from "../../core/models/desafios/quiz/quiz";
import { QuizGame } from "../../core/models/desafios/quiz/quiz-game";
import { Resposta } from "../../core/models/desafios/quiz/resposta";

export type FeedbackQuiz = 'correto' | 'incorreto' | undefined;

@Injectable({ providedIn: 'root' })
export class QuizService extends DesafioBaseService {
    private readonly _game = signal<QuizGame | undefined>(undefined);
    private readonly _indice = signal<number>(0);

    // ── Leitura pública ────────────────────────────────────────────────────
    public readonly game = this._game.asReadonly();
    public readonly indice = this._indice.asReadonly();

    public readonly temJogo = computed(() => !!this._game());

    public readonly perguntaAtual = computed(() =>
        this._game()?.pergunta(this._indice())
    );

    public readonly respostasDisponiveis = computed(() =>
        this._game()?.respostas(this._indice()) ?? []
    );

    public readonly concluido = computed(() => {
        return this._game()?.concluido ?? false;
    });

    public readonly totalCorretas = computed(() => {
        return this._game()?.totalCorretas ?? 0;
    });

    public readonly totalIncorretas = computed(() => {
        return this._game()?.totalIncorretas ?? 0;
    });

    // ── Ações ──────────────────────────────────────────────────────────────
    public init(quiz: Quiz): void {
        this._game.set(new QuizGame(quiz));
        this._indice.set(0);
        this._progresso.set(0);
    }

    public clear(): void {
        this._game.set(undefined);
        this._indice.set(0);
        this._progresso.set(0);
    }

    public async validarResposta(resposta: Resposta): Promise<FeedbackQuiz> {
        const game = this._game();
        if (!game || this._solicitando()) return undefined;

        // calcula resultado localmente (mock)
        const resultadoLocal = game.validar(resposta, this._indice());

        // simula latência de rede (substitua por chamada HTTP)
        const resultado = await this.simularValidacao<FeedbackQuiz>(resultadoLocal);

        this._progresso.set(game.porcentagemConclusao());

        return resultado;
    }

    /** Avança para a próxima pergunta — atualizar _indice dispara reatividade */
    public proxima(): void {
        const game = this._game();
        if (!game) return;
        const proximo = this._indice() + 1;
        if (proximo >= game.quiz.perguntas.length) return;
        this._indice.set(proximo);
    }

    /** Volta para a pergunta anterior */
    public voltar(): void {
        const anterior = this._indice() - 1;
        if (anterior < 0) return;
        this._indice.set(anterior);
    }
}