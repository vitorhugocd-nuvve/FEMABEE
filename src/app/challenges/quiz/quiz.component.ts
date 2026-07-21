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
                            class="w-full items-start text-left">
                            <input
                                type="radio"
                                [id]="resposta.id"
                                [checked]="selecao() === resposta"
                                bee-checkbox
                                single />
                            <div class="w-full">{{ resposta.texto }}</div>
                        </button>
                    }
                </div>
            </div>

            <bee-indicator class="w-full!" #indicator />

            <!-- Botão de ação principal -->
            <button
                (click)="show()"
                bee-button
                size="large"
                class="w-full text-center"
                [disabled]="!selecao() && solicitando()">
                Verificar
            </button>

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
    readonly quizService = inject(QuizService);

    readonly selecao = signal<Resposta | undefined>(undefined);
    readonly quiz = computed(() => this.quizService.game()?.quiz);
    readonly pergunta = computed(() => this.quizService.perguntaAtual());
    readonly respostas = computed(() => this.quizService.respostasDisponiveis());
    readonly concluido = computed(() => this.quizService.concluido());
    readonly solicitando = computed(() => this.quizService.solicitando());
    readonly totalPerguntas = computed(() => this.quizService.game()?.quiz.perguntas.length ?? 0);
    readonly numeroPergunta = computed(() => this.quizService.indice() + 1);

    private readonly _carregarDados = effect(() => {
        const data = this.buscarQuizService.data();
        if (!data) return;
        this.quizService.init(data);
    });

    show() {
        this.indicator()?.show(new Indication({title: 'Errou!', message: "A resposta escolhida foi incorrreta.", severity: 'danger' }))
    }
}