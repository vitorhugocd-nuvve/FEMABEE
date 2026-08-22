import { Component, computed, DestroyRef, ElementRef, effect, inject, signal, viewChild } from "@angular/core";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { TextComponent } from "../../../ui/typography/text.component";
import { LicaoConteudoComponent } from "./licao-conteudo.component";
import { LicaoService } from "./licao.service";
import { BuscarLicaoService } from "./buscar-licao.service";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";
import { ScreenService } from "../../../services/tela/screen.service";

@Component({
    selector: 'app-desafio-licao',
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <button bee-button size="small" (click)="fechar()" aria-label="Voltar ao mapa">
                    <bee-icon icon="arrow-left" />
                </button>
                <span class="font-semibold">Lição · {{ padrao() }}</span>
            </div>
        </bee-card-header>

        <bee-card-content #conteudoScroll class="flex flex-col items-center h-full overflow-auto!" [class]="gap()">
            <app-licao-conteudo [markdown]="licaoService.licao()?.conteudoMarkdown ?? ''" [alturaCodigo]="alturaCodigo()">
                <div #fimDoTexto></div>

                <!-- Resultado final -->
                @if (concluida()) {
                    <div class="shadow-border border-2 border-green-400 bg-green-100 p-0.5 flex flex-col gap-1 w-full">
                        <div class="px-2 py-1 text-sm bg-gradient-to-r from-green-600 to-green-400 w-full flex flex-row gap-2 items-center">
                            <bee-icon icon="check" [width]="16" />
                            <bee-text class="font-bold text-white!">Lição concluída!</bee-text>
                        </div>
                    </div>
                }
            </app-licao-conteudo>

            <!-- Botão de ação principal — só aparece quando dá pra fazer algo -->
            @if (mostrarBotaoAcao()) {
                <button
                    (click)="acao()"
                    bee-button
                    size="large"
                    class="w-full text-center shrink-0"
                    [disabled]="solicitando()">
                    @if (solicitando()) {
                        <bee-icon icon="loader" class="animate-spin" />
                        Concluindo...
                    } @else if (concluida()) {
                        <bee-icon icon="map" />
                        Voltar ao mapa
                    } @else {
                        <bee-icon icon="check" />
                        Concluir
                    }
                </button>
            }
        </bee-card-content>
    </bee-card>
    `,
    host: {
        class: 'pattern-background h-screen w-screen flex',
        '[class]': 'hostPadding()'
    },
    providers: [BuscarLicaoService],
    imports: [
        BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent,
        IconComponent, ButtonComponent, TextComponent, LicaoConteudoComponent
    ]
})
export class DesafioLicaoComponent {
    private readonly buscarService = inject(BuscarLicaoService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly screenService = inject(ScreenService);
    readonly licaoService = inject(LicaoService);

    private readonly containerRef = viewChild('conteudoScroll', { read: ElementRef<HTMLElement> });
    private readonly sentinelRef = viewChild('fimDoTexto', { read: ElementRef<HTMLElement> });

    private observer?: IntersectionObserver;

    readonly padrao = computed(() => this.licaoService.padrao());
    readonly concluida = computed(() => this.licaoService.concluida());
    readonly solicitando = computed(() => this.licaoService.solicitando());
    readonly chegouAoFim = signal(false);

    /** O botão só aparece quando dá pra fazer algo (concluir ou voltar ao mapa) — senão fica omitido em vez de desabilitado. */
    readonly mostrarBotaoAcao = computed(() => {
        if (this.concluida()) return true;
        return this.chegouAoFim() || this.solicitando();
    });

    /** No mobile a tela tem menos espaço sobrando; menos padding e blocos de código mais altos (o wrap de linha ocupa mais altura). */
    protected readonly hostPadding = computed(() => this.screenService.isMobile() ? 'p-2' : 'p-4');
    protected readonly alturaCodigo = computed(() => this.screenService.isMobile() ? 'h-72' : 'h-56');
    protected readonly gap = computed(() => this.screenService.isMobile() ? 'gap-2' : 'gap-4');

    private readonly _carregarDados = effect(() => {
        const desafio = this.buscarService.data();
        if (!desafio) return;
        this.licaoService.iniciar(desafio);
        this.chegouAoFim.set(false);
    });

    private readonly _observarFim = effect(() => {
        this.licaoService.licao();
        const container = this.containerRef()?.nativeElement;
        const sentinela = this.sentinelRef()?.nativeElement;
        if (!container || !sentinela) return;

        this.observer?.disconnect();
        this.observer = new IntersectionObserver(
            entradas => {
                if (entradas.some(entrada => entrada.isIntersecting)) this.chegouAoFim.set(true);
            },
            { root: container, threshold: 0 }
        );
        this.observer.observe(sentinela);
    });

    constructor() {
        inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
    }

    acao(): void {
        if (this.concluida()) {
            this.fechar();
            return;
        }
        if (!this.chegouAoFim()) return;
        this.licaoService.concluir();
    }

    fechar(): void {
        this.desafioAtualService.fechar();
    }
}
