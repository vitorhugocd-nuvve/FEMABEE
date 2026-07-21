import { Component, computed, effect, inject, signal } from "@angular/core";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { BuscarCompleteTextoService } from "./buscar-complete-texto.service";
import { ProgressbarComponent } from "../../../ui/progressbar/progressbar.component";
import { CompleteTextoService } from "./complete-texto.service";
import { NgClass } from "@angular/common";

@Component({
    selector: 'app-desafio-complete-texto',
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <button bee-button size="small" [disabled]="!podeVoltar()" (click)="voltar()">
                    <bee-icon icon="arrow-left" />
                </button>
                <span class="font-semibold">Complete o Texto · {{ padrao() }}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">
                    {{ numeroTexto() }}/{{ totalTextos() }}
                </span>
                <button bee-button size="small">
                    <bee-icon icon="heart" />
                    10
                </button>
            </div>
        </bee-card-header>

        <bee-card-content class="flex flex-col items-center h-full gap-4">
            <!-- Progresso -->
            <bee-progressbar [value]="progresso()" />

            <!-- Corpo do desafio -->
            <div class="flex flex-col w-full h-full gap-4 overflow-auto">

                <!-- Texto com lacunas renderizado -->
                <bee-card class="w-full! h-fit! p-4" direction="down">
                    <p class="text-base leading-relaxed">
                        @for (parte of partesTexto(); track $index) {
                            @if (parte.tipo === 'texto') {
                                <span>{{ parte.conteudo }}</span>
                            } @else {
                                <!-- Lacuna interativa -->
                                <span
                                    class="inline-flex items-center mx-1 px-3 py-0.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer"
                                    [ngClass]="classeSlot(parte.indice)"
                                    (click)="removerSelecao(parte.indice)">
                                    {{ opcaoSelecionada(parte.indice) ?? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}
                                    @if (opcaoSelecionada(parte.indice)) {
                                        <bee-icon icon="x" class="ml-1 h-3 w-3 opacity-60" />
                                    }
                                </span>
                            }
                        }
                    </p>
                </bee-card>

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

                <!-- Feedback -->
                @if (feedback()) {
                    <div
                        class="rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 transition-all duration-300"
                        [ngClass]="feedback() === 'correto'
                            ? 'bg-green-500/15 text-green-600 border border-green-500/30'
                            : 'bg-red-500/15 text-red-600 border border-red-500/30'">
                        <bee-icon [icon]="feedback() === 'correto' ? 'check-circle' : 'x-circle'" />
                        {{ feedback() === 'correto'
                            ? '🎉 Perfeito! Todas as lacunas estão corretas!'
                            : '❌ Algumas respostas estão incorretas. Tente novamente!' }}
                    </div>
                }

                <!-- Resultado final -->
                @if (concluido()) {
                    <div class="rounded-xl px-4 py-4 bg-primary/10 border border-primary/30 text-center w-full">
                        <p class="font-bold text-lg">Desafio concluído! 🏆</p>
                        <p class="text-sm text-muted-foreground">
                            Você completou <strong>{{ totalCorretas() }}</strong> de <strong>{{ totalTextos() }}</strong> textos corretamente.
                        </p>
                    </div>
                }
            </div>

            <!-- Botão de ação principal -->
            <button
                (click)="acao()"
                bee-button
                size="large"
                class="w-full text-center"
                [disabled]="!todasLacunasPreenchidas() && !jaRespondeu() || solicitando()">
                @if (solicitando()) {
                    <bee-icon icon="loader-2" class="animate-spin" />
                    Verificando...
                } @else if (jaRespondeu() && podeAvancar()) {
                    Próximo
                    <bee-icon icon="arrow-right" />
                } @else if (jaRespondeu() && !podeAvancar() && !concluido()) {
                    Tentar novamente
                    <bee-icon icon="refresh-cw" />
                } @else {
                    <bee-icon icon="send" />
                    Verificar
                }
            </button>
        </bee-card-content>
    </bee-card>
    `,
    host: { class: 'p-4 pattern-background h-screen w-screen flex' },
    providers: [BuscarCompleteTextoService],
    imports: [
        BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent,
        IconComponent, ButtonComponent, ProgressbarComponent, NgClass
    ]
})
export class DesafioCompleteTextoComponent {
    private readonly buscarService = inject(BuscarCompleteTextoService);
    readonly completeTextoService  = inject(CompleteTextoService);

    /** Opções selecionadas para cada lacuna: índice (1-based) → string | undefined */
    private readonly _selecionadas = signal<Map<number, string>>(new Map());

    readonly jaRespondeu  = computed(() => this.completeTextoService.stateAtual()?.concluido ?? false);
    readonly feedback     = computed(() => this.completeTextoService.feedback());
    readonly podeAvancar  = computed(() => this.completeTextoService.podeAvancar());
    readonly podeVoltar   = computed(() => this.completeTextoService.podeVoltar());
    readonly concluido    = computed(() => this.completeTextoService.concluido());
    readonly progresso    = computed(() => this.completeTextoService.progressoReal());
    readonly solicitando  = computed(() => this.completeTextoService.solicitando());
    readonly totalCorretas = computed(() => this.completeTextoService.totalCorretas());
    readonly totalTextos  = computed(() => this.completeTextoService.totalTextos());
    readonly padrao       = computed(() => this.completeTextoService.desafio()?.padrao);
    readonly numeroTexto  = computed(() => (this.completeTextoService.desafio()?.indice ?? 0) + 1);

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
            } else {
                // tenta de novo: limpa o estado
                this.completeTextoService.stateAtual()?.reset();
                this.completeTextoService.limparFeedback();
                this._selecionadas.set(new Map());
            }
            return;
        }

        if (!this.todasLacunasPreenchidas()) return;

        const lacunas = this.partesTexto()
            .filter(p => p.tipo === 'lacuna')
            .sort((a, b) => a.indice - b.indice);

        const opcoesSelecionadas = lacunas.map(l => this._selecionadas().get(l.indice) ?? '');
        await this.completeTextoService.validar(opcoesSelecionadas);
    }

    voltar(): void {
        this.completeTextoService.voltar();
        this._selecionadas.set(new Map());
    }
}