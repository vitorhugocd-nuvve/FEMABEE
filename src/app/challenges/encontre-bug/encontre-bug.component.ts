import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from "@angular/core";
import { NgClass } from "@angular/common";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { ProgressbarComponent } from "../../../ui/progressbar/progressbar.component";
import { LargeComponent } from "../../../ui/typography/large.component";
import { TextComponent } from "../../../ui/typography/text.component";
import { BottomDrawerComponent } from "../../../ui/bottom-drawer/bottom-drawer.component";
import { CodeEditorComponent } from "../../../ui/code-editor/code-editor.component";
import { IndicatorComponent } from "../../../ui/indicator/indicator.component";
import { Indication } from "../../../ui/indicator/indication";
import { EncontreBugService } from "./encontre-bug.service";
import { BuscarEncontreBugService } from "./buscar-encontre-bug.service";
import { Arquivo } from "../../core/models/desafios/encontre-bug/arquivo";
import { RespostaBug } from "../../core/models/desafios/encontre-bug/resposta-bug";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";
import { SomService } from "../../../services/som/som.service";
import { SequenciaSemErrarService } from "../../core/progresso/sequencia-sem-errar.service";

@Component({
    selector: 'app-desafio-encontre-bug',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <button bee-button size="small" [disabled]="!podeVoltar()" (click)="voltarPergunta()">
                    <bee-icon icon="arrow-left" />
                </button>
                <span class="font-semibold">Encontre o Bug · {{ padrao() }}</span>
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

        <bee-card-content class="flex flex-col items-center h-full gap-3 overflow-auto!">
            <bee-progressbar [value]="progresso()" />

            <div class="flex flex-col w-full h-full gap-3 overflow-auto">
                <!-- Cartão de arquivo: abre o drawer de seleção -->
                <button
                    bee-button
                    class="w-full justify-between"
                    (click)="arquivoDrawerAberto.set(true)">
                    <span class="text-xs font-semibold truncate">{{ arquivoAtual()?.nome }}</span>
                    <span class="flex items-center gap-1 text-xs shrink-0">
                        <bee-icon icon="folder" />
                        {{ totalArquivos() }}
                    </span>
                </button>

                <!-- Editor Monaco -->
                <bee-code-editor
                    class="w-full h-56"
                    [value]="arquivoAtual()?.codigo ?? ''"
                    [language]="arquivoAtual()?.linguagem ?? 'plaintext'"
                    [readOnly]="true" />

                <!-- Pergunta -->
                <bee-card class="w-full! h-fit! p-2" direction="down">
                    <bee-large>{{ pergunta()?.enunciado }}</bee-large>
                </bee-card>

                <!-- Abre o drawer de resposta -->
                <button
                    bee-button
                    size="large"
                    class="w-full text-center"
                    [disabled]="solicitando()"
                    (click)="respostaDrawerAberto.set(true)">
                    @if (jaRespondeu()) {
                        <bee-icon icon="check-circle" />
                        Ver resposta
                    } @else {
                        <bee-icon icon="send" />
                        Escolher resposta
                    }
                </button>
            </div>
        </bee-card-content>
    </bee-card>

    <!-- Drawer: escolher arquivo -->
    <bee-bottom-drawer [(open)]="arquivoDrawerAberto" title="Escolher arquivo">
        <div class="flex flex-col gap-2">
            @for (arquivo of arquivos(); track arquivo.id; let i = $index) {
                <button
                    bee-button
                    class="w-full justify-between"
                    [ngClass]="{ 'bg-primary/20! border-primary!': i === indiceArquivo() }"
                    (click)="selecionarArquivo(i)">
                    {{ arquivo.nome }}
                    @if (i === indiceArquivo()) {
                        <bee-icon icon="check" />
                    }
                </button>
            }
        </div>
    </bee-bottom-drawer>

    <!-- Drawer: escolher resposta / ver feedback -->
    <bee-bottom-drawer [(open)]="respostaDrawerAberto" [title]="tituloRespostaDrawer()">
        <bee-indicator #resultadoIndicator class="w-full!" />
        @if (!jaRespondeu()) {
            <div class="flex flex-col gap-2">
                @for (resposta of respostas(); track resposta.id) {
                    <button
                        bee-button
                        class="w-full text-left"
                        [disabled]="solicitando()"
                        (click)="responder(resposta.id)">
                        {{ resposta.texto }}
                    </button>
                }
            </div>
        } @else {
            <div class="flex flex-col gap-4">
                <bee-text>{{ pergunta()?.explicacao }}</bee-text>
                <button
                    bee-button
                    size="large"
                    class="w-full text-center"
                    (click)="fecharDrawerResposta()">
                    @if (concluidoDesafio()) {
                        <bee-icon icon="check-circle" />
                        Concluir
                    } @else {
                        Próxima pergunta
                        <bee-icon icon="arrow-right" />
                    }
                </button>
            </div>
        }
    </bee-bottom-drawer>
    `,
    host: { class: 'p-4 pattern-background h-screen w-screen flex' },
    providers: [BuscarEncontreBugService],
    imports: [
        BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent, IndicatorComponent,
        IconComponent, ButtonComponent, ProgressbarComponent, LargeComponent, TextComponent,
        BottomDrawerComponent, CodeEditorComponent, NgClass
    ]
})
export class DesafioEncontreBugComponent {
    private readonly buscarService = inject(BuscarEncontreBugService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly somService = inject(SomService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly resultadoIndicator = viewChild<IndicatorComponent>('resultadoIndicator');
    readonly encontreBugService = inject(EncontreBugService);

    /** Índice do arquivo em exibição, dentro da pergunta atual */
    readonly indiceArquivo = signal(0);
    readonly arquivoDrawerAberto = signal(false);
    readonly respostaDrawerAberto = signal(false);

    readonly padrao         = computed(() => this.encontreBugService.desafio()?.padrao);
    readonly numeroPergunta = computed(() => (this.encontreBugService.desafio()?.indice ?? 0) + 1);
    readonly totalPerguntas = computed(() => this.encontreBugService.totalPerguntas());
    readonly progresso      = computed(() => this.encontreBugService.progresso());
    readonly solicitando    = computed(() => this.encontreBugService.solicitando());
    readonly podeVoltar     = computed(() => this.encontreBugService.podeVoltar());
    readonly jaRespondeu    = computed(() => this.encontreBugService.stateAtual()?.concluido ?? false);
    readonly concluidoDesafio = computed(() => this.encontreBugService.concluido());

    readonly pergunta      = computed(() => this.encontreBugService.stateAtual()?.pergunta);
    readonly arquivos      = computed<Arquivo[]>(() => this.pergunta()?.arquivos ?? []);
    readonly totalArquivos = computed(() => this.arquivos().length);
    readonly arquivoAtual  = computed<Arquivo | undefined>(() => this.arquivos().at(this.indiceArquivo()));
    readonly respostas     = computed<RespostaBug[]>(() => this.pergunta()?.respostas ?? []);

    readonly tituloRespostaDrawer = computed(() => {
        if (!this.jaRespondeu()) return 'Qual é o problema?';
        return this.encontreBugService.stateAtual()?.resultado === 'correto' ? 'Correto! 🎉' : 'Ops, não foi dessa vez';
    });

    private readonly _carregarDados = effect(() => {
        const desafio = this.buscarService.data();
        if (!desafio) return;
        this.encontreBugService.iniciar(desafio);
    });

    /** Volta a exibir o primeiro arquivo sempre que a pergunta muda */
    private readonly _resetArquivo = effect(() => {
        this.pergunta()?.id;
        this.indiceArquivo.set(0);
    });

    selecionarArquivo(indice: number): void {
        this.indiceArquivo.set(indice);
        this.arquivoDrawerAberto.set(false);
    }

    async responder(respostaId: string): Promise<void> {
        if (this.jaRespondeu() || this.solicitando()) return;
        const resultado = await this.encontreBugService.responder(respostaId);

        if (resultado === 'correto') {
            this.somService.sucesso();
            this.resultadoIndicator()?.show(new Indication({ message: 'Boa! Você encontrou o problema.', severity: 'success', ttlInMs: 2000 }));
        } else if (resultado === 'incorreto') {
            this.somService.erro();
            this.sequenciaSemErrarService.registrarErro();
            this.resultadoIndicator()?.show(new Indication({ message: 'Não foi dessa vez.', severity: 'danger', ttlInMs: 2000 }));
        }
    }

    fecharDrawerResposta(): void {
        this.respostaDrawerAberto.set(false);
        if (this.concluidoDesafio()) {
            this.fechar();
        } else {
            this.encontreBugService.avancar();
        }
    }

    voltarPergunta(): void {
        this.encontreBugService.voltar();
    }

    fechar(): void {
        this.desafioAtualService.fechar();
    }
}
