import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from "@angular/core";
import { NgClass } from "@angular/common";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { TextComponent } from "../../../ui/typography/text.component";
import { ProgressbarComponent } from "../../../ui/progressbar/progressbar.component";
import { IndicatorComponent } from "../../../ui/indicator/indicator.component";
import { Indication } from "../../../ui/indicator/indication";
import { BeeDividerComponent } from "../../../ui/divider/divider.component";
import { EncontreParesService } from "./encontre-pares.service";
import { BuscarEncontreParesService } from "./buscar-encontre-pares.service";
import { Par } from "../../core/models/desafios/encontre-pares/par";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";
import { SomService } from "../../../services/som/som.service";
import { SequenciaSemErrarService } from "../../core/progresso/sequencia-sem-errar.service";
import { ScreenService } from "../../../services/tela/screen.service";

@Component({
    selector: 'app-desafio-encontre-pares',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <button bee-button size="small" (click)="fechar()" aria-label="Voltar ao mapa">
                    <bee-icon icon="arrow-left" />
                </button>
                <span class="font-semibold">Encontre os Pares · {{ padrao() }}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">
                    {{ numeroRodada() }}/{{ totalRodadas() }}
                </span>
            </div>
        </bee-card-header>

        <bee-card-content class="flex flex-col items-center h-full overflow-auto!" [class]="gap()">
            <bee-progressbar [value]="progresso()" />

            <div class="flex flex-col w-full h-full overflow-auto" [class]="gap()">
                <p class="text-xs text-muted-foreground text-center">
                    Toque em um termo e depois na descrição que combina com ele.
                </p>

                <!-- Termos: linha compacta que se ajusta ao conteúdo (mobile-first) -->
                <div class="flex flex-wrap gap-2 justify-center">
                    @for (par of afirmacoes(); track par.id) {
                        <button
                            bee-button
                            size="small"
                            [ngClass]="classeCartao(par.id, selecaoAfirmacao())"
                            [disabled]="solicitando() || jaResolvido(par.id)"
                            (click)="selecionarAfirmacao(par.id)">
                            {{ par.afirmacao }}
                            @if (jaResolvido(par.id)) {
                                <bee-icon icon="check" />
                            }
                        </button>
                    }
                </div>

                <bee-divider direction="horizontal" />

                <!-- Descrições: cartões empilhados em coluna única, largura cheia -->
                <div class="flex flex-col gap-2">
                    @for (par of correspondencias(); track par.id) {
                        <button
                            bee-button
                            class="w-full h-fit! text-left justify-between"
                            [ngClass]="classeCartao(par.id, selecaoCorrespondencia())"
                            [disabled]="solicitando() || jaResolvido(par.id)"
                            (click)="selecionarCorrespondencia(par.id)">
                            <span class="text-sm">{{ par.correspondencia }}</span>
                            @if (jaResolvido(par.id)) {
                                <bee-icon icon="check" />
                            }
                        </button>
                    }
                </div>

                <!-- Resultado final -->
                @if (concluidoDesafio()) {
                    <div class="shadow-border border-2 border-green-400 bg-green-100 p-0.5 flex flex-col gap-1 w-full">
                        <div class="px-2 py-1 text-sm bg-gradient-to-r from-green-600 to-green-400 w-full flex flex-row gap-2 items-center">
                            <bee-icon icon="check" [width]="16" />
                            <bee-text class="font-bold text-white!">Desafio concluído!</bee-text>
                        </div>
                        <bee-text class="px-2 py-1">
                            Você formou todos os pares de {{ totalRodadas() }} rodadas.
                        </bee-text>
                    </div>
                }
            </div>

            <bee-indicator #indicator />

            <!-- Botão de ação principal — só aparece quando dá pra fazer algo -->
            @if (mostrarBotaoAcao()) {
                <button
                    (click)="acao()"
                    bee-button
                    size="large"
                    class="w-full text-center"
                    [disabled]="solicitando()">
                    @if (solicitando()) {
                        <bee-icon icon="loader" class="animate-spin" />
                        Conferindo...
                    } @else if (concluidoDesafio()) {
                        <bee-icon icon="map" />
                        Voltar ao mapa
                    } @else {
                        Próxima rodada
                        <bee-icon icon="arrow-right" />
                    }
                </button>
            }
        </bee-card-content>
    </bee-card>
    `,
    host: { class: 'pattern-background h-screen w-screen flex', '[class]': 'hostPadding()' },
    providers: [BuscarEncontreParesService],
    imports: [
        BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent,
        IconComponent, ButtonComponent, TextComponent, ProgressbarComponent, IndicatorComponent, BeeDividerComponent, NgClass
    ]
})
export class DesafioEncontreParesComponent {
    private readonly indicator = viewChild<IndicatorComponent>('indicator');
    private readonly buscarService = inject(BuscarEncontreParesService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly somService = inject(SomService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly screenService = inject(ScreenService);
    readonly encontreParesService = inject(EncontreParesService);

    /** No mobile a tela tem menos espaço sobrando — padding e gap do card ficam mais compactos. */
    protected readonly hostPadding = computed(() => this.screenService.isMobile() ? 'p-2' : 'p-4');
    protected readonly gap = computed(() => this.screenService.isMobile() ? 'gap-2' : 'gap-4');

    /** Id do `Par` selecionado do lado das afirmações / correspondências */
    readonly selecaoAfirmacao = signal<string | undefined>(undefined);
    readonly selecaoCorrespondencia = signal<string | undefined>(undefined);

    readonly padrao          = computed(() => this.encontreParesService.desafio()?.padrao);
    readonly numeroRodada    = computed(() => (this.encontreParesService.desafio()?.indice ?? 0) + 1);
    readonly totalRodadas    = computed(() => this.encontreParesService.totalRodadas());
    readonly progresso       = computed(() => this.encontreParesService.progressoReal());
    readonly solicitando     = computed(() => this.encontreParesService.solicitando());
    readonly concluidoRodada = computed(() => this.encontreParesService.stateAtual()?.concluido ?? false);
    readonly concluidoDesafio = computed(() => this.encontreParesService.concluido());

    /** O botão só aparece quando dá pra fazer algo (avançar de rodada ou voltar ao mapa) — senão fica omitido em vez de desabilitado. */
    readonly mostrarBotaoAcao = computed(() => {
        return this.concluidoRodada() || this.solicitando();
    });

    /** Ordem fixa (mesma ordem cadastrada na rodada) */
    readonly afirmacoes = computed<Par[]>(() => this.encontreParesService.stateAtual()?.rodada.pares ?? []);

    /** Mesmos pares, embaralhados — só reembaralha quando a rodada muda */
    readonly correspondencias = computed<Par[]>(() => this.embaralhar(this.afirmacoes()));

    private readonly _carregarDados = effect(() => {
        const desafio = this.buscarService.data();
        if (!desafio) return;
        this.encontreParesService.iniciar(desafio);
        this.limparSelecao();
    });

    private embaralhar(pares: Par[]): Par[] {
        const copia = [...pares];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

    jaResolvido(parId: string): boolean {
        return this.encontreParesService.stateAtual()?.foiResolvido(parId) ?? false;
    }

    classeCartao(parId: string, selecionadoId: string | undefined): Record<string, boolean> {
        return {
            'bg-green-500/20! border-green-600! text-green-800!': this.jaResolvido(parId),
            'bg-primary/20! translate-y-[1.5px]': selecionadoId === parId,
        };
    }

    selecionarAfirmacao(parId: string): void {
        if (this.solicitando() || this.jaResolvido(parId)) return;
        this.selecaoAfirmacao.update(atual => atual === parId ? undefined : parId);
        this.tentarCombinar();
    }

    selecionarCorrespondencia(parId: string): void {
        if (this.solicitando() || this.jaResolvido(parId)) return;
        this.selecaoCorrespondencia.update(atual => atual === parId ? undefined : parId);
        this.tentarCombinar();
    }

    private async tentarCombinar(): Promise<void> {
        const afirmacaoId = this.selecaoAfirmacao();
        const correspondenciaId = this.selecaoCorrespondencia();
        if (!afirmacaoId || !correspondenciaId) return;

        const resultado = await this.encontreParesService.confirmarPar(afirmacaoId, correspondenciaId);

        if (resultado === 'incorreto') {
            this.somService.erro();
            this.sequenciaSemErrarService.registrarErro();
            this.indicator()?.show(new Indication({
                title: 'Não foi dessa vez!',
                message: 'Essas cartas não formam um par.',
                severity: 'danger',
                ttlInMs: 1500,
                toast: true,
                toastPosition: 'bottom',
            }));
        } else if (resultado === 'correto') {
            this.somService.sucesso();
        }

        this.limparSelecao();
    }

    private limparSelecao(): void {
        this.selecaoAfirmacao.set(undefined);
        this.selecaoCorrespondencia.set(undefined);
    }

    acao(): void {
        if (this.concluidoDesafio()) {
            this.fechar();
            return;
        }
        this.proximaRodada();
    }

    proximaRodada(): void {
        this.encontreParesService.avancar();
        this.limparSelecao();
    }

    fechar(): void {
        this.desafioAtualService.fechar();
    }
}
