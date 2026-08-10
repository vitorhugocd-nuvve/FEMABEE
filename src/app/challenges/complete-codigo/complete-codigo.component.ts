import { ChangeDetectionStrategy, Component, computed, effect, inject, viewChild } from "@angular/core";
import { NgClass } from "@angular/common";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { ProgressbarComponent } from "../../../ui/progressbar/progressbar.component";
import { CodeDiffComponent } from "../../../ui/code-diff/code-diff.component";
import { IndicatorComponent } from "../../../ui/indicator/indicator.component";
import { Indication } from "../../../ui/indicator/indication";
import { CompleteCodigoService } from "./complete-codigo.service";
import { BuscarCompleteCodigoService } from "./buscar-complete-codigo.service";
import { Trecho } from "../../core/models/desafios/complete-codigo/trecho";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";
import { SomService } from "../../../services/som/som.service";
import { SequenciaSemErrarService } from "../../core/progresso/sequencia-sem-errar.service";

@Component({
    selector: 'app-desafio-complete-codigo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <button bee-button size="small" [disabled]="!podeVoltar()" (click)="voltar()">
                    <bee-icon icon="arrow-left" />
                </button>
                <span class="font-semibold">Complete o Código · {{ padrao() }}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">
                    {{ numeroCodigo() }}/{{ totalCodigos() }}
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
                <span class="text-xs font-semibold text-muted-foreground truncate w-full">{{ arquivo() }}</span>

                <!-- Diff: código com a lacuna vs. trecho selecionado -->
                <bee-code-diff
                    class="w-full h-56"
                    [original]="codigoOriginal()"
                    [modified]="codigoModificado()"
                    [language]="linguagem()" />

                <p class="text-xs text-muted-foreground text-center">
                    Toque no cartão com o trecho que completa corretamente o código.
                </p>

                <!-- Cards de opções -->
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

                <bee-indicator #indicator class="w-full!" />

                @if (feedback()) {
                    <bee-card class="w-full! h-fit! p-2" direction="down">
                        <span class="text-xs">{{ codigoAtualModel()?.explicacao }}</span>
                    </bee-card>
                }

                <!-- Resultado final -->
                @if (concluidoDesafio()) {
                    <div class="px-4 py-4 bg-primary/10 border border-primary/30 text-center w-full">
                        <p class="font-bold text-lg">Desafio concluído! 🏆</p>
                        <p class="text-sm text-muted-foreground">
                            Você completou <strong>{{ totalCorretos() }}</strong> de <strong>{{ totalCodigos() }}</strong> códigos corretamente.
                        </p>
                    </div>
                }
            </div>

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
                    } @else if (concluidoAtual() && concluidoDesafio()) {
                        <bee-icon icon="check-circle" />
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
            }
        </bee-card-content>
    </bee-card>
    `,
    host: { class: 'p-4 pattern-background h-screen w-screen flex' },
    providers: [BuscarCompleteCodigoService],
    imports: [
        BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent,
        IconComponent, ButtonComponent, ProgressbarComponent, CodeDiffComponent, NgClass, IndicatorComponent
    ]
})
export class DesafioCompleteCodigoComponent {
    private readonly buscarService = inject(BuscarCompleteCodigoService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly somService = inject(SomService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly indicator = viewChild<IndicatorComponent>('indicator');
    readonly completeCodigoService = inject(CompleteCodigoService);

    readonly padrao        = computed(() => this.completeCodigoService.desafio()?.padrao);
    readonly numeroCodigo  = computed(() => (this.completeCodigoService.desafio()?.indice ?? 0) + 1);
    readonly totalCodigos  = computed(() => this.completeCodigoService.totalCodigos());
    readonly totalCorretos = computed(() => this.completeCodigoService.totalCorretos());
    readonly progresso     = computed(() => this.completeCodigoService.progresso());
    readonly solicitando   = computed(() => this.completeCodigoService.solicitando());
    readonly podeVoltar    = computed(() => this.completeCodigoService.podeVoltar());
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

    selecionarOpcao(id: string): void {
        if (this.concluidoAtual() || this.solicitando()) return;
        const atual = this.selecaoAtual();
        this.completeCodigoService.selecionar(atual === id ? undefined : id);
        this.completeCodigoService.limparFeedback();
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
            this.indicator()?.show(new Indication({ message: 'Perfeito! Esse é o trecho correto.', severity: 'success', ttlInMs: 2000 }));
        } else if (resultado === 'incorreto') {
            this.somService.erro();
            this.sequenciaSemErrarService.registrarErro();
            this.indicator()?.show(new Indication({ message: 'Esse trecho não resolve o problema. Tente novamente!', severity: 'danger', ttlInMs: 2000 }));
        }
    }

    voltar(): void {
        this.completeCodigoService.voltar();
    }

    fechar(): void {
        this.desafioAtualService.fechar();
    }
}
