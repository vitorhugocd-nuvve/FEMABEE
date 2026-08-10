import { Component, computed, effect, inject, signal, viewChild } from "@angular/core";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { ProgressbarComponent } from "../../../ui/progressbar/progressbar.component";
import { QuizService } from "./quiz.service";
import { BuscarQuizService } from "./buscar-quiz.service";
import { LargeComponent } from "../../../ui/typography/large.component";
import { CheckboxDirective } from "../../../ui/checkbox/checkbox.component";
import { Resposta } from "../../core/models/desafios/quiz/resposta";
import { NgClass } from "@angular/common";
import { IndicatorComponent } from "../../../ui/indicator/indicator.component";
import { Indication } from "../../../ui/indicator/indication";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";
import { SomService } from "../../../services/som/som.service";
import { SequenciaSemErrarService } from "../../core/progresso/sequencia-sem-errar.service";

@Component({
    selector: 'app-desafio-quiz',
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <button bee-button size="small">
                    <bee-icon icon="arrow-left" />
                </button>
                <span class="font-semibold">Quiz · {{ quiz()?.padrao }}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">
                    {{ numeroPergunta() }}/{{ totalPerguntas() }}
                </span>
                <button bee-button size="small">
                    <bee-icon icon="heart" />
                    10
                </button>
                <button bee-button size="small" (click)="fechar()" aria-label="Fechar desafio">
                    <bee-icon icon="x" />
                </button>
            </div>
        </bee-card-header>

        <bee-card-content class="flex flex-col items-center h-full gap-4 overflow-auto!">
            <bee-progressbar />

            <!-- Bloco principal -->
            <div class="flex flex-col w-full h-full overflow-auto gap-4">

                <!-- Pergunta -->
                <bee-card class="w-full! h-fit! p-2" direction="down">
                    <bee-large>{{ pergunta()?.texto }}</bee-large>
                </bee-card>

                <!-- Respostas -->
                <div class="flex flex-col gap-2 overflow-auto">
                    @for (resposta of respostas(); track resposta.id) {
                        <button
                            bee-button
                            class="w-full items-start text-left"
                            [ngClass]="classeResposta(resposta)"
                            [disabled]="jaRespondeu() || solicitando()"
                            (click)="escolher(resposta)">
                            <input
                                type="radio"
                                [id]="resposta.id"
                                [checked]="selecao() === resposta"
                                bee-checkbox
                                single />
                            <div class="w-full">{{ resposta.texto }}</div>
                            @if (jaRespondeu() && resposta.correta) {
                                <bee-icon icon="check" />
                            } @else if (jaRespondeu() && selecao() === resposta) {
                                <bee-icon icon="x" />
                            }
                        </button>
                    }
                </div>
            </div>

            <bee-indicator class="w-full!" #indicator />

            <!-- Resultado final -->
            @if (jaRespondeu() && !podeAvancar()) {
                <div class="px-4 py-4 bg-primary/10 border border-primary/30 text-center w-full">
                    <p class="font-bold text-lg">Quiz concluído! 🏆</p>
                    <p class="text-sm text-muted-foreground">
                        Você acertou <strong>{{ quizService.totalCorretas() }}</strong> de <strong>{{ totalPerguntas() }}</strong> perguntas.
                    </p>
                </div>
            }

            <!-- Botão de ação principal — só aparece quando dá pra fazer algo -->
            @if (mostrarBotaoAcao()) {
                <button
                    (click)="acao()"
                    bee-button
                    size="large"
                    class="w-full text-center"
                    [disabled]="solicitando()">
                    @if (solicitando()) {
                        <bee-icon icon="loader-2" class="animate-spin" />
                        Verificando...
                    } @else if (jaRespondeu() && podeAvancar()) {
                        Próxima
                        <bee-icon icon="arrow-right" />
                    } @else if (jaRespondeu()) {
                        <bee-icon icon="check-circle" />
                        Voltar ao mapa
                    } @else {
                        <bee-icon icon="send" />
                        Verificar
                    }
                </button>
            }

        </bee-card-content>
    </bee-card>
    `,
    host: { class: 'p-4 pattern-background h-screen w-screen flex' },
    providers: [BuscarQuizService],
    imports: [
    BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent,
    IconComponent, ButtonComponent, ProgressbarComponent,
    LargeComponent, CheckboxDirective, NgClass,
    IndicatorComponent
]
})
export class DesafioQuizComponent {
    private readonly indicator = viewChild<IndicatorComponent>('indicator');
    private readonly buscarQuizService = inject(BuscarQuizService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly somService = inject(SomService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    readonly quizService = inject(QuizService);

    readonly selecao = signal<Resposta | undefined>(undefined);
    readonly quiz = computed(() => this.quizService.quiz());
    readonly pergunta = computed(() => this.quizService.perguntaAtual());
    readonly respostas = computed(() => this.quizService.respostasDisponiveis());
    readonly concluido = computed(() => this.quizService.concluido());
    readonly solicitando = computed(() => this.quizService.solicitando());
    readonly totalPerguntas = computed(() => this.quizService.totalPerguntas());
    readonly numeroPergunta = computed(() => this.quizService.indice() + 1);

    /** Estado da pergunta atual (respondida ou não, e o resultado) */
    readonly jaRespondeu = computed(() => this.quizService.stateAtual()?.concluido ?? false);
    readonly podeAvancar = computed(() => this.quizService.indice() < this.totalPerguntas() - 1);

    /** O botão só aparece quando há algo a fazer (verificar, avançar ou voltar ao mapa) — senão fica omitido em vez de desabilitado. */
    readonly mostrarBotaoAcao = computed(() => {
        if (this.solicitando() || this.jaRespondeu()) return true;
        return !!this.selecao();
    });

    private readonly _carregarDados = effect(() => {
        const data = this.buscarQuizService.data();
        if (!data) return;
        this.quizService.init(data);
        this.selecao.set(undefined);
    });

    escolher(resposta: Resposta): void {
        if (this.jaRespondeu() || this.solicitando()) return;
        this.selecao.set(resposta);
    }

    classeResposta(resposta: Resposta): Record<string, boolean> {
        if (!this.jaRespondeu()) return {};

        const selecionada = this.selecao() === resposta;
        return {
            'bg-green-500/20! border-green-600!': resposta.correta,
            'bg-red-500/20! border-red-600!': selecionada && !resposta.correta,
            'opacity-50': !resposta.correta && !selecionada,
        };
    }

    async acao(): Promise<void> {
        if (this.solicitando()) return;

        if (this.jaRespondeu()) {
            if (this.podeAvancar()) {
                this.quizService.proxima();
                this.selecao.set(undefined);
            } else {
                this.fechar();
            }
            return;
        }

        const resposta = this.selecao();
        if (!resposta) return;

        const resultado = await this.quizService.validarResposta(resposta);

        if (resultado === 'correto') {
            this.somService.sucesso();
            this.indicator()?.show(new Indication({ title: 'Acertou!', message: 'Resposta certa. 🎉', severity: 'success', ttlInMs: 1800 }));
        } else {
            this.somService.erro();
            this.sequenciaSemErrarService.registrarErro();
            this.indicator()?.show(new Indication({ title: 'Errou!', message: 'A resposta escolhida foi incorreta.', severity: 'danger', ttlInMs: 1800 }));
        }
    }

    fechar() {
        this.desafioAtualService.fechar();
    }
}