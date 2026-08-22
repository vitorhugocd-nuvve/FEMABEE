import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from "@angular/core";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { TextComponent } from "../../../ui/typography/text.component";
import { ProgressbarComponent } from "../../../ui/progressbar/progressbar.component";
import { CodeDiffComponent } from "../../../ui/code-diff/code-diff.component";
import { CodeEditorComponent } from "../../../ui/code-editor/code-editor.component";
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
import { GirarDispositivoComponent } from "../../../ui/girar-dispositivo/girar-dispositivo.component";

@Component({
    selector: 'app-desafio-complete-codigo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <bee-girar-dispositivo />
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

        <!-- Quase sem gap: o código ocupa o card inteiro, só a barra de ações embaixo (só existe 1 arquivo aqui, não precisa de rótulo) -->
        <bee-card-content class="flex flex-col h-full overflow-hidden! gap-1! p-1!">
            <bee-code-diff
                class="w-full flex-1 min-h-0"
                [original]="codigoOriginal()"
                [modified]="codigoModificado()"
                [language]="linguagem()" />

            <!-- Barra de progresso no canto inferior esquerdo, botão de selecionar logo ao lado -->
            <div class="w-full flex flex-row items-center gap-2 shrink-0">
                <bee-progressbar [value]="progresso()" class="flex-1 min-w-0 w-auto!" />

                @if (!concluidoAtual()) {
                    <button
                        bee-button
                        class="shrink-0"
                        [ngClass]="classeBotaoSelecionar()"
                        [disabled]="solicitando()"
                        (click)="selecionarAberto.set(true)"
                        [attr.aria-label]="selecaoAtual() ? 'Trocar o trecho selecionado' : 'Selecionar o trecho que completa o código'">
                        <bee-icon [icon]="selecaoAtual() ? 'repeat' : 'list-box'" />
                        @if (!selecaoAtual()) {
                            Selecionar
                        }
                    </button>
                }

                @if (mostrarBotaoAcao()) {
                    <ng-container [ngTemplateOutlet]="botaoAcao" />
                }
            </div>
        </bee-card-content>
    </bee-card>

    <bee-indicator #indicator />

    <!-- Drawer: escolher o trecho -->
    <bee-bottom-drawer [(open)]="selecionarAberto" title="Selecione o trecho">
        <ng-container [ngTemplateOutlet]="listaOpcoes" />
    </bee-bottom-drawer>

    <!-- Drawer: feedback da validação (evita ocupar espaço em cima do código) -->
    <bee-bottom-drawer [(open)]="feedbackAberto" [title]="tituloFeedback()">
        <div class="flex flex-col gap-3">
            <bee-text>{{ codigoAtualModel()?.explicacao }}</bee-text>
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
        </div>
    </bee-bottom-drawer>

    <!-- Cards de opções -->
    <ng-template #listaOpcoes>
        <p class="text-xs text-muted-foreground text-center">
            Toque no cartão com o trecho que completa corretamente o código.
        </p>
        <div class="flex flex-col gap-2">
            @for (opcao of opcoes(); track opcao.id) {
                <button
                    bee-button
                    class="w-full h-fit! p-1! text-left items-stretch"
                    [ngClass]="classeOpcao(opcao.id)"
                    [disabled]="concluidoAtual() || solicitando()"
                    (click)="selecionarOpcao(opcao.id)">
                    <bee-code-editor
                        class="pointer-events-none flex-1 min-w-0 h-20 border-0! shadow-none!"
                        [value]="dedentar(opcao.codigo)"
                        [language]="linguagem()"
                        [readOnly]="true"
                        wordWrap="on"
                        lineNumbers="off" />
                    @if (concluidoAtual() && selecaoAtual() === opcao.id) {
                        <bee-icon icon="check" class="shrink-0 self-center mr-1" />
                    }
                </button>
            }
        </div>
    </ng-template>

    <!-- Botão de ação principal — só aparece quando dá pra fazer algo -->
    <ng-template #botaoAcao>
        <button
            (click)="acao()"
            bee-button
            class="text-center shrink-0"
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
                <bee-icon icon="refresh" />
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
        IconComponent, ButtonComponent, TextComponent, ProgressbarComponent, CodeDiffComponent, CodeEditorComponent, NgClass, NgTemplateOutlet,
        IndicatorComponent, BottomDrawerComponent, GirarDispositivoComponent
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

    /** No mobile a tela tem menos espaço sobrando — padding do card fica mais compacto. */
    protected readonly hostPadding = computed(() => this.screenService.isMobile() ? 'p-2' : 'p-4');

    /** Controla o drawer de seleção de trecho. */
    protected readonly selecionarAberto = signal(false);
    /** Controla o drawer com a explicação do resultado (aberto automaticamente ao validar). */
    protected readonly feedbackAberto = signal(false);

    readonly padrao        = computed(() => this.completeCodigoService.desafio()?.padrao);
    readonly numeroCodigo  = computed(() => (this.completeCodigoService.desafio()?.indice ?? 0) + 1);
    readonly totalCodigos  = computed(() => this.completeCodigoService.totalCodigos());
    readonly totalCorretos = computed(() => this.completeCodigoService.totalCorretos());
    readonly progresso     = computed(() => this.completeCodigoService.progresso());
    readonly solicitando   = computed(() => this.completeCodigoService.solicitando());
    readonly feedback      = computed(() => this.completeCodigoService.feedback());
    readonly concluidoAtual   = computed(() => this.completeCodigoService.stateAtual()?.concluido ?? false);
    readonly concluidoDesafio = computed(() => this.completeCodigoService.concluido());

    readonly tituloFeedback = computed(() => this.feedback() === 'correto' ? 'Boa! 🎉' : 'Não foi dessa vez');

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

    /** Abre o drawer de feedback assim que há um resultado, e fecha quando ele é limpo (próximo código). */
    private readonly _sincronizarFeedbackDrawer = effect(() => {
        this.feedbackAberto.set(!!this.feedback());
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

    /** Destaca o botão flutuante de seleção quando já há um trecho escolhido. */
    classeBotaoSelecionar(): Record<string, boolean> {
        return { 'bg-primary/20! border-primary!': !!this.selecaoAtual() };
    }

    /**
     * O trecho vem indentado do jeito que fica dentro do template original (8-12 espaços),
     * mas aqui é mostrado isolado num cartão pequeno — sem tirar essa indentação, o código
     * fica todo empurrado pra direita, sobrando quase nada de largura útil pra ler.
     */
    protected dedentar(codigo: string): string {
        const linhas = codigo.split('\n');
        const indentacoes = linhas
            .filter(linha => linha.trim().length > 0)
            .map(linha => linha.match(/^ */)?.[0].length ?? 0);
        const menorIndentacao = indentacoes.length ? Math.min(...indentacoes) : 0;
        if (menorIndentacao === 0) return codigo;
        return linhas.map(linha => linha.slice(menorIndentacao)).join('\n');
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
