import { Component, computed, effect, inject, signal, viewChild } from "@angular/core";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { TextComponent } from "../../../ui/typography/text.component";
import { BuscarCompleteTextoService } from "./buscar-complete-texto.service";
import { ProgressbarComponent } from "../../../ui/progressbar/progressbar.component";
import { CompleteTextoService } from "./complete-texto.service";
import { NgClass } from "@angular/common";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";
import { SomService } from "../../../services/som/som.service";
import { IndicatorComponent } from "../../../ui/indicator/indicator.component";
import { Indication } from "../../../ui/indicator/indication";
import { SequenciaSemErrarService } from "../../core/progresso/sequencia-sem-errar.service";
import { ScreenService } from "../../../services/tela/screen.service";

@Component({
    selector: 'app-desafio-complete-texto',
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <button bee-button size="small" (click)="fechar()" aria-label="Voltar ao mapa">
                    <bee-icon icon="arrow-left" />
                </button>
                <span class="font-semibold">Complete o Texto · {{ padrao() }}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">
                    {{ numeroTexto() }}/{{ totalTextos() }}
                </span>
            </div>
        </bee-card-header>

        <bee-card-content class="flex flex-col items-center h-full" [class]="gap()">
            <!-- Progresso -->
            <bee-progressbar [value]="progresso()" />

            <!-- Corpo do desafio -->
            <div class="flex flex-col w-full h-full overflow-auto" [class]="gap()">

                <!-- Texto com lacunas renderizado -->
                <div class="w-full bg-white shadow-border border-2 border-black p-4">
                    <p class="text-base leading-[1.75] max-w-prose mx-auto">
                        @for (parte of partesTexto(); track $index) {
                            @if (parte.tipo === 'texto') {
                                <span>{{ parte.conteudo }}</span>
                            } @else {
                                <!-- Lacuna interativa -->
                                <span
                                    class="inline-flex items-center mx-1 px-3 py-0.5 border text-sm font-medium transition-all duration-200 cursor-pointer"
                                    [ngClass]="classeSlot(parte.indice)"
                                    (click)="removerSelecao(parte.indice)">
                                    {{ opcaoSelecionada(parte.indice) ?? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}
                                    @if (opcaoSelecionada(parte.indice)) {
                                        <bee-icon icon="close" class="ml-1 h-3 w-3 opacity-60" />
                                    }
                                </span>
                            }
                        }
                    </p>
                </div>

                <!-- Banco de opções -->
                <div class="flex flex-wrap gap-2">
                    @for (opcao of opcoesFiltradas(); track opcao) {
                        <button
                            bee-button
                            size="small"
                            [disabled]="jaRespondeu() || solicitando()"
                            [ngClass]="{ 'opacity-40': jaRespondeu() }"
                            (click)="selecionarOpcao(opcao)">
                            {{ opcao }}
                        </button>
                    }
                    @if (!opcoesFiltradas().length && !jaRespondeu()) {
                        <p class="text-xs text-muted-foreground italic">Todas as opções foram utilizadas.</p>
                    }
                </div>

                <bee-indicator #indicator />

                <!-- Resultado final -->
                @if (jaRespondeu() && !podeAvancar()) {
                    <div class="shadow-border border-2 p-0.5 flex flex-col gap-1 w-full" [class]="corResultadoFinal()">
                        <div class="px-2 py-1 text-sm bg-gradient-to-r w-full flex flex-row gap-2 items-center" [class]="corCabecalhoResultadoFinal()">
                            <bee-icon [icon]="completeTextoAprovado() ? 'check' : 'close'" [width]="16" />
                            <bee-text class="font-bold text-white!">{{ completeTextoAprovado() ? 'Desafio concluído!' : 'Desafio não concluído' }}</bee-text>
                        </div>
                        <bee-text class="px-2 py-1">
                            Você completou {{ totalCorretas() }} de {{ totalTextos() }} textos corretamente.
                            @if (!completeTextoAprovado()) {
                                Acerte todos pra concluir a fase.
                            }
                        </bee-text>
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
                        <bee-icon icon="loader" class="animate-spin" />
                        Verificando...
                    } @else if (jaRespondeu() && podeAvancar()) {
                        Próximo
                        <bee-icon icon="arrow-right" />
                    } @else if (jaRespondeu() && completeTextoAprovado()) {
                        <bee-icon icon="map" />
                        Voltar ao mapa
                    } @else if (jaRespondeu()) {
                        <bee-icon icon="refresh" />
                        Tentar de novo
                    } @else {
                        <bee-icon icon="send" />
                        Verificar
                    }
                </button>
            }
        </bee-card-content>
    </bee-card>
    `,
    host: { class: 'pattern-background h-screen w-screen flex', '[class]': 'hostPadding()' },
    providers: [BuscarCompleteTextoService],
    imports: [
        BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent,
        IconComponent, ButtonComponent, TextComponent, ProgressbarComponent, NgClass, IndicatorComponent
    ]
})
export class DesafioCompleteTextoComponent {
    private readonly buscarService = inject(BuscarCompleteTextoService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly somService = inject(SomService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly indicator = viewChild<IndicatorComponent>('indicator');
    private readonly screenService = inject(ScreenService);
    readonly completeTextoService  = inject(CompleteTextoService);

    /** No mobile a tela tem menos espaço sobrando — padding e gap do card ficam mais compactos. */
    protected readonly hostPadding = computed(() => this.screenService.isMobile() ? 'p-2' : 'p-4');
    protected readonly gap = computed(() => this.screenService.isMobile() ? 'gap-2' : 'gap-4');

    /** Opções selecionadas para cada lacuna: índice (1-based) → string | undefined */
    private readonly _selecionadas = signal<Map<number, string>>(new Map());

    readonly jaRespondeu  = computed(() => this.completeTextoService.stateAtual()?.concluido ?? false);
    readonly podeAvancar  = computed(() => this.completeTextoService.podeAvancar());
    readonly concluido    = computed(() => this.completeTextoService.concluido());
    readonly progresso    = computed(() => this.completeTextoService.progressoReal());
    readonly solicitando  = computed(() => this.completeTextoService.solicitando());
    readonly totalCorretas = computed(() => this.completeTextoService.totalCorretas());
    readonly totalTextos  = computed(() => this.completeTextoService.totalTextos());
    readonly padrao       = computed(() => this.completeTextoService.desafio()?.padrao);
    readonly numeroTexto  = computed(() => (this.completeTextoService.desafio()?.indice ?? 0) + 1);

    /** Só conta como aprovado (e libera "Voltar ao mapa") se acertou todos os textos do desafio. */
    readonly completeTextoAprovado = computed(() => this.totalCorretas() === this.totalTextos());
    readonly corResultadoFinal = computed(() => this.completeTextoAprovado() ? 'border-green-400 bg-green-100' : 'border-red-400 bg-red-100');
    readonly corCabecalhoResultadoFinal = computed(() => this.completeTextoAprovado() ? 'from-green-600 to-green-400' : 'from-red-600 to-red-400');

    /** O botão só aparece quando há algo a fazer (verificar, avançar ou voltar ao mapa) — senão fica omitido em vez de desabilitado. */
    readonly mostrarBotaoAcao = computed(() => {
        if (this.solicitando() || this.jaRespondeu()) return true;
        return this.todasLacunasPreenchidas();
    });

    private readonly _carregarDados = effect(() => {
        const desafio = this.buscarService.data();
        if (!desafio) return;
        this.completeTextoService.iniciar(desafio);
        this._selecionadas.set(new Map());
    });

    // ── Parsing do texto em partes ─────────────────────────────────────────
    readonly partesTexto = computed<Array<{ tipo: 'texto' | 'lacuna'; conteudo: string; indice: number }>>(() => {
        const texto = this.completeTextoService.stateAtual()?.texto.texto ?? '';
        const partes: Array<{ tipo: 'texto' | 'lacuna'; conteudo: string; indice: number }> = [];
        const regex = /\{\{(\d+)\}\}/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(texto)) !== null) {
            if (match.index > lastIndex) {
                partes.push({ tipo: 'texto', conteudo: texto.slice(lastIndex, match.index), indice: -1 });
            }
            partes.push({ tipo: 'lacuna', conteudo: '', indice: Number(match[1]) });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < texto.length) {
            partes.push({ tipo: 'texto', conteudo: texto.slice(lastIndex), indice: -1 });
        }
        return partes;
    });

    /** Opções ainda não selecionadas */
    readonly opcoesFiltradas = computed(() => {
        const opcoes = this.completeTextoService.stateAtual()?.texto.opcoes ?? [];
        const usadas = Array.from(this._selecionadas().values());
        return opcoes.filter(op => !usadas.includes(op));
    });

    readonly todasLacunasPreenchidas = computed(() => {
        const total = this.partesTexto().filter(p => p.tipo === 'lacuna').length;
        return this._selecionadas().size === total;
    });

    opcaoSelecionada(indice: number): string | undefined {
        return this._selecionadas().get(indice);
    }

    classeSlot(indice: number): Record<string, boolean> {
        const preenchida = !!this._selecionadas().get(indice);
        const respondeu  = this.jaRespondeu();
        const state      = this.completeTextoService.stateAtual();
        const correto    = respondeu && state?.resultado === 'correto';
        return {
            'border-dashed border-muted-foreground/40 bg-muted/40': !preenchida && !respondeu,
            'border-primary bg-primary/10': preenchida && !respondeu,
            'border-green-500 bg-green-500/15 text-green-700': respondeu && correto,
            'border-red-500 bg-red-500/15 text-red-700': respondeu && !correto,
        };
    }

    selecionarOpcao(opcao: string): void {
        if (this.jaRespondeu() || this.solicitando()) return;
        // ocupa a primeira lacuna livre
        const lacunas = this.partesTexto().filter(p => p.tipo === 'lacuna');
        const primeira = lacunas.find(l => !this._selecionadas().has(l.indice));
        if (!primeira) return;
        this._selecionadas.update(m => new Map(m).set(primeira.indice, opcao));
    }

    removerSelecao(indice: number): void {
        if (this.jaRespondeu() || this.solicitando()) return;
        this._selecionadas.update(m => {
            const nova = new Map(m);
            nova.delete(indice);
            return nova;
        });
    }

    async acao(): Promise<void> {
        if (this.solicitando()) return;

        if (this.jaRespondeu()) {
            if (this.podeAvancar()) {
                this.completeTextoService.avancar();
                this._selecionadas.set(new Map());
            } else if (this.completeTextoAprovado()) {
                this.fechar();
            } else {
                this.completeTextoService.reiniciar();
                this._selecionadas.set(new Map());
            }
            return;
        }

        if (!this.todasLacunasPreenchidas()) return;

        const lacunas = this.partesTexto()
            .filter(p => p.tipo === 'lacuna')
            .sort((a, b) => a.indice - b.indice);

        const opcoesSelecionadas = lacunas.map(l => this._selecionadas().get(l.indice) ?? '');
        const resultado = await this.completeTextoService.validar(opcoesSelecionadas);

        if (resultado === 'correto') {
            this.somService.sucesso();
            this.indicator()?.show(new Indication({ message: 'Perfeito! Todas as lacunas estão corretas.', severity: 'success', ttlInMs: 2000, toast: true, toastPosition: 'bottom' }));
        } else if (resultado === 'incorreto') {
            this.somService.erro();
            this.sequenciaSemErrarService.registrarErro();
            this.indicator()?.show(new Indication({ message: 'Algumas respostas estão incorretas. Tente novamente!', severity: 'danger', ttlInMs: 2000, toast: true, toastPosition: 'bottom' }));
        }
    }

    fechar(): void {
        this.desafioAtualService.fechar();
    }
}