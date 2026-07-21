import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from "@angular/core";
import { NgClass } from "@angular/common";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { ProgressbarComponent } from "../../../ui/progressbar/progressbar.component";
import { IndicatorComponent } from "../../../ui/indicator/indicator.component";
import { Indication } from "../../../ui/indicator/indication";
import { BeeDividerComponent } from "../../../ui/divider/divider.component";
import { EncontreParesService } from "./encontre-pares.service";
import { BuscarEncontreParesService } from "./buscar-encontre-pares.service";
import { Par } from "../../core/models/desafios/encontre-pares/par";

@Component({
    selector: 'app-desafio-encontre-pares',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <button bee-button size="small" [disabled]="!podeVoltar()" (click)="voltarRodada()">
                    <bee-icon icon="arrow-left" />
                </button>
                <span class="font-semibold">Encontre os Pares · {{ padrao() }}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">
                    {{ numeroRodada() }}/{{ totalRodadas() }}
                </span>
                <button bee-button size="small">
                    <bee-icon icon="heart" />
                    10
                </button>
            </div>
        </bee-card-header>

        <bee-card-content class="flex flex-col items-center h-full gap-4 overflow-auto!">
            <bee-progressbar [value]="progresso()" />

            <div class="flex flex-col w-full h-full gap-3 overflow-auto">
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
                    <div class="rounded-xl px-4 py-4 bg-primary/10 border border-primary/30 text-center w-full">
                        <p class="font-bold text-lg">Desafio concluído! 🏆</p>
                        <p class="text-sm text-muted-foreground">
                            Você formou todos os pares de <strong>{{ totalRodadas() }}</strong> rodadas.
                        </p>
                    </div>
                }
            </div>

            <bee-indicator class="w-full!" #indicator />

            <!-- Botão de ação principal -->
            <button
                (click)="proximaRodada()"
                bee-button
                size="large"
                class="w-full text-center"
                [disabled]="!concluidoRodada() || solicitando() || concluidoDesafio()">
                @if (solicitando()) {
                    <bee-icon icon="loader-2" class="animate-spin" />
                    Conferindo...
                } @else if (concluidoDesafio()) {
                    <bee-icon icon="check-circle" />
                    Concluído!
                } @else if (concluidoRodada()) {
                    Próxima rodada
                    <bee-icon icon="arrow-right" />
                } @else {
                    <bee-icon icon="link" />
                    Toque nas cartas para formar os pares
                }
            </button>
        </bee-card-content>
    </bee-card>
    `,
    host: { class: 'p-4 pattern-background h-screen w-screen flex' },
    providers: [BuscarEncontreParesService],
    imports: [
        BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent,
        IconComponent, ButtonComponent, ProgressbarComponent, IndicatorComponent, BeeDividerComponent, NgClass
    ]
})
export class DesafioEncontreParesComponent {
    private readonly indicator = viewChild<IndicatorComponent>('indicator');
    private readonly buscarService = inject(BuscarEncontreParesService);
    readonly encontreParesService = inject(EncontreParesService);

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
    readonly podeVoltar      = computed(() => this.encontreParesService.podeVoltar());

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
            this.indicator()?.show(new Indication({
                title: 'Não foi dessa vez!',
                message: 'Essas cartas não formam um par.',
                severity: 'danger',
                ttlInMs: 1500,
            }));
        }

        this.limparSelecao();
    }

    private limparSelecao(): void {
        this.selecaoAfirmacao.set(undefined);
        this.selecaoCorrespondencia.set(undefined);
    }

    proximaRodada(): void {
        this.encontreParesService.avancar();
        this.limparSelecao();
    }

    voltarRodada(): void {
        this.encontreParesService.voltar();
        this.limparSelecao();
    }
}
