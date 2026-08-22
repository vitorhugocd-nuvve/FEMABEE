import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from "@angular/core";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { TextComponent } from "../../../ui/typography/text.component";
import { ProgressbarComponent } from "../../../ui/progressbar/progressbar.component";
import { CodeDiffComponent } from "../../../ui/code-diff/code-diff.component";
import { IndicatorComponent } from "../../../ui/indicator/indicator.component";
import { Indication } from "../../../ui/indicator/indication";
import { BottomDrawerComponent } from "../../../ui/bottom-drawer/bottom-drawer.component";
import { CompleteCodigoService } from "./complete-codigo.service";
import { BuscarCompleteCodigoService } from "./buscar-complete-codigo.service";
import { Trecho } from "../../core/models/desafios/complete-codigo/trecho";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";
import { SomService } from "../../../services/som/som.service";
import { SequenciaSemErrarService } from "../../core/progresso/sequencia-sem-errar.service";
import { ScreenService } from "../../../services/tela/screen.service";

@Component({
    selector: 'app-desafio-complete-codigo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <button bee-button size="small" (click)="fechar()" aria-label="Voltar ao mapa">
                    <bee-icon icon="arrow-left" />
                </button>
                <span class="font-semibold">Complete o Código · {{ padrao() }}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">
                    {{ numeroCodigo() }}/{{ totalCodigos() }}
                </span>
            </div>
        </bee-card-header>

        <bee-card-content class="flex flex-col h-full overflow-auto!" [class]="gap()">
            <bee-progressbar [value]="progresso()" />

            @if (isDesktop()) {
                <!-- Desktop: opções à esquerda (1/3), código à direita (2/3) -->
                <div class="flex flex-row w-full flex-1 min-h-0 gap-3">
                    <div class="flex flex-col w-1/3 shrink-0 h-full gap-3 overflow-auto">
                        <ng-container [ngTemplateOutlet]="listaOpcoes" />
                        <ng-container [ngTemplateOutlet]="estadoDesafio" />
                        @if (mostrarBotaoAcao()) {
                            <div class="w-full mt-auto">
                                <ng-container [ngTemplateOutlet]="botaoAcao" />
                            </div>
                        }
                    </div>

                    <div class="flex flex-col w-2/3 min-w-0 h-full gap-2">
                        <span class="text-xs font-semibold text-muted-foreground truncate w-full">{{ arquivo() }}</span>
                        <bee-code-diff
                            class="w-full flex-1 min-h-0"
                            [original]="codigoOriginal()"
                            [modified]="codigoModificado()"
                            [language]="linguagem()" />
                    </div>
                </div>
            } @else {
                <!-- Mobile: código ocupa a tela, opções ficam num drawer -->
                <div class="flex flex-col w-full flex-1 min-h-0 gap-3">
                    <span class="text-xs font-semibold text-muted-foreground truncate w-full">{{ arquivo() }}</span>
                    <bee-code-diff
                        class="w-full flex-1 min-h-0"
                        [original]="codigoOriginal()"
                        [modified]="codigoModificado()"
                        [language]="linguagem()" />

                    <ng-container [ngTemplateOutlet]="estadoDesafio" />

                    <div class="flex flex-row gap-2 shrink-0">
                        <button
                            bee-button
                            size="large"
                            class="flex-1 justify-center"
                            [ngClass]="classeBotaoSelecionar()"
                            [disabled]="concluidoAtual() || solicitando()"
                            (click)="selecionarAberto.set(true)">
                            <bee-icon [icon]="selecaoAtual() ? 'check' : 'list'" />
                            Selecionar
                        </button>
                        @if (mostrarBotaoAcao()) {
                            <div class="flex-1">
                                <ng-container [ngTemplateOutlet]="botaoAcao" />
                            </div>
                        }
                    </div>
                </div>

                <bee-bottom-drawer [(open)]="selecionarAberto" title="Selecione o trecho">
                    <div class="flex flex-col gap-2">
                        <ng-container [ngTemplateOutlet]="listaOpcoes" />
                    </div>
                </bee-bottom-drawer>
            }
        </bee-card-content>
    </bee-card>

    <!-- Cards de opções -->
    <ng-template #listaOpcoes>
        <p class="text-xs text-muted-foreground text-center">
            Toque no cartão com o trecho que completa corretamente o código.
        </p>
        <div class="flex flex-col gap-2">
            @for (opcao of opcoes(); track opcao.id) {
                <button
                    bee-button
                    class="w-full h-fit! text-left justify-between"
                    [ngClass]="classeOpcao(opcao.id)"
                    [disabled]="concluidoAtual() || solicitando()"
                    (click)="selecionarOpcao(opcao.id)">
                    <span class="text-xs whitespace-pre-wrap">{{ opcao.codigo }}</span>
                    @if (concluidoAtual() && selecaoAtual() === opcao.id) {
                        <bee-icon icon="check" />
                    }
                </button>
            }
        </div>
    </ng-template>

    <!-- Indicador de feedback + resultado final -->
    <ng-template #estadoDesafio>
        <bee-indicator #indicator />

        @if (feedback()) {
            <div class="w-full bg-white shadow-border border-2 border-black p-2">
                <span class="text-xs">{{ codigoAtualModel()?.explicacao }}</span>
            </div>
        }

        @if (concluidoDesafio()) {
            <div class="shadow-border border-2 border-green-400 bg-green-100 p-0.5 flex flex-col gap-1 w-full">
                <div class="px-2 py-1 text-sm bg-gradient-to-r from-green-600 to-green-400 w-full flex flex-row gap-2 items-center">
                    <bee-icon icon="check" [width]="16" />
                    <bee-text class="font-bold text-white!">Desafio concluído!</bee-text>
                </div>
                <bee-text class="px-2 py-1">
                    Você completou {{ totalCorretos() }} de {{ totalCodigos() }} códigos corretamente.
                </bee-text>
            </div>
        }
    </ng-template>

    <!-- Botão de ação principal — só aparece quando dá pra fazer algo -->
    <ng-template #botaoAcao>
        <button
            (click)="acao()"
            bee-button
            size="large"
            class="w-full text-center"
            [disabled]="solicitando()">
            @if (solicitando()) {
                <bee-icon icon="loader" class="animate-spin" />
                Verificando...
            } @else if (concluidoAtual() && concluidoDesafio()) {
                <bee-icon icon="map" />
                Voltar ao mapa
            } @else if (concluidoAtual()) {
                Próximo
                <bee-icon icon="arrow-right" />
            } @else if (feedback() === 'incorreto') {
                Tentar novamente
                <bee-icon icon="refresh-cw" />
            } @else {
                <bee-icon icon="send" />
                Verificar
            }
        </button>
    </ng-template>
    `,
    host: { class: 'pattern-background h-screen w-screen flex', '[class]': 'hostPadding()' },
    providers: [BuscarCompleteCodigoService],
    imports: [
        BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent,
        IconComponent, ButtonComponent, TextComponent, ProgressbarComponent, CodeDiffComponent, NgClass, NgTemplateOutlet,
        IndicatorComponent, BottomDrawerComponent
    ]
})
export class DesafioCompleteCodigoComponent {
    private readonly buscarService = inject(BuscarCompleteCodigoService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly somService = inject(SomService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly screenService = inject(ScreenService);
    private readonly indicator = viewChild<IndicatorComponent>('indicator');
    readonly completeCodigoService = inject(CompleteCodigoService);

    protected readonly isDesktop = this.screenService.isDesktop;

    /** No mobile a tela tem menos espaço sobrando — padding e gap do card ficam mais compactos. */
    protected readonly hostPadding = computed(() => this.screenService.isMobile() ? 'p-2' : 'p-4');
    protected readonly gap = computed(() => this.screenService.isMobile() ? 'gap-2' : 'gap-3');

    /** Controla o drawer de seleção de trecho no mobile. */
    protected readonly selecionarAberto = signal(false);

    readonly padrao        = computed(() => this.completeCodigoService.desafio()?.padrao);
    readonly numeroCodigo  = computed(() => (this.completeCodigoService.desafio()?.indice ?? 0) + 1);
    readonly totalCodigos  = computed(() => this.completeCodigoService.totalCodigos());
    readonly totalCorretos = computed(() => this.completeCodigoService.totalCorretos());
    readonly progresso     = computed(() => this.completeCodigoService.progresso());
    readonly solicitando   = computed(() => this.completeCodigoService.solicitando());
    readonly feedback      = computed(() => this.completeCodigoService.feedback());
    readonly concluidoAtual   = computed(() => this.completeCodigoService.stateAtual()?.concluido ?? false);
    readonly concluidoDesafio = computed(() => this.completeCodigoService.concluido());

    readonly codigoAtualModel = computed(() => this.completeCodigoService.stateAtual()?.codigo);
    readonly arquivo    = computed(() => this.codigoAtualModel()?.arquivo);
    readonly linguagem  = computed(() => this.codigoAtualModel()?.linguagem ?? 'plaintext');
    readonly opcoes     = computed<Trecho[]>(() => this.codigoAtualModel()?.opcoes ?? []);
    readonly selecaoAtual = computed(() => this.completeCodigoService.stateAtual()?.trechoSelecionadoId);

    readonly trechoSelecionado = computed<Trecho | undefined>(() => {
        const id = this.selecaoAtual();
        return this.opcoes().find(o => o.id === id);
    });

    readonly codigoOriginal   = computed(() => this.codigoAtualModel()?.montarCodigo() ?? '');
    readonly codigoModificado = computed(() => this.codigoAtualModel()?.montarCodigo(this.trechoSelecionado()) ?? '');

    /** O botão só aparece quando há algo a fazer (verificar, avançar ou voltar ao mapa) — senão fica omitido em vez de desabilitado. */
    readonly mostrarBotaoAcao = computed(() => {
        if (this.solicitando() || this.concluidoAtual() || this.feedback() === 'incorreto') return true;
        return !!this.selecaoAtual();
    });

    private readonly _carregarDados = effect(() => {
        const desafio = this.buscarService.data();
        if (!desafio) return;
        this.completeCodigoService.iniciar(desafio);
    });

    classeOpcao(id: string): Record<string, boolean> {
        const selecionado = this.selecaoAtual() === id;
        const concluido = this.concluidoAtual();
        return {
            'bg-primary/20! border-primary!': selecionado && !concluido,
            'bg-green-500/20! border-green-600!': selecionado && concluido,
            'opacity-50': concluido && !selecionado,
        };
    }

    /** Destaca o botão "Selecionar" quando já há um trecho escolhido, sem precisar reabrir o drawer pra saber. */
    classeBotaoSelecionar(): Record<string, boolean> {
        return { 'bg-primary/20! border-primary!': !!this.selecaoAtual() };
    }

    selecionarOpcao(id: string): void {
        if (this.concluidoAtual() || this.solicitando()) return;
        const atual = this.selecaoAtual();
        this.completeCodigoService.selecionar(atual === id ? undefined : id);
        this.completeCodigoService.limparFeedback();
        this.selecionarAberto.set(false);
    }

    async acao(): Promise<void> {
        if (this.solicitando()) return;

        if (this.concluidoAtual()) {
            if (this.concluidoDesafio()) {
                this.fechar();
                return;
            }
            this.completeCodigoService.avancar();
            return;
        }

        if (this.feedback() === 'incorreto') {
            this.completeCodigoService.limparFeedback();
            return;
        }

        if (!this.selecaoAtual()) return;
        const resultado = await this.completeCodigoService.validar();

        if (resultado === 'correto') {
            this.somService.sucesso();
            this.indicator()?.show(new Indication({ message: 'Perfeito! Esse é o trecho correto.', severity: 'success', ttlInMs: 2000, toast: true, toastPosition: 'bottom' }));
        } else if (resultado === 'incorreto') {
            this.somService.erro();
            this.sequenciaSemErrarService.registrarErro();
            this.indicator()?.show(new Indication({ message: 'Esse trecho não resolve o problema. Tente novamente!', severity: 'danger', ttlInMs: 2000, toast: true, toastPosition: 'bottom' }));
        }
    }

    fechar(): void {
        this.desafioAtualService.fechar();
    }
}
