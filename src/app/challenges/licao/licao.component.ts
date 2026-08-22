import { Component, computed, DestroyRef, ElementRef, effect, inject, signal, viewChild } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { marked, Token } from "marked";
import { BeeCardComponent, BeeCardHeaderComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { TextComponent } from "../../../ui/typography/text.component";
import { CodeEditorComponent } from "../../../ui/code-editor/code-editor.component";
import { MermaidComponent } from "../../../ui/mermaid/mermaid.component";
import { LicaoService } from "./licao.service";
import { BuscarLicaoService } from "./buscar-licao.service";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";
import { ScreenService } from "../../../services/tela/screen.service";

type BlocoLicao =
    | { tipo: 'codigo'; linguagem: string; conteudo: string }
    | { tipo: 'html'; conteudo: SafeHtml };

@Component({
    selector: 'app-desafio-licao',
    template: `
    <bee-card class="w-full h-full!">
        <!-- Cabeçalho -->
        <bee-card-header>
            <div class="flex flex-row gap-2 items-center">
                <span class="font-semibold">Lição · {{ padrao() }}</span>
            </div>
            <div class="flex items-center gap-2">
                <button bee-button size="small" (click)="fechar()" aria-label="Fechar desafio">
                    <bee-icon icon="x" />
                </button>
            </div>
        </bee-card-header>

        <bee-card-content #conteudoScroll class="flex flex-col items-center h-full gap-4 overflow-auto!">
            <div class="licao-coluna shadow-border border-2 border-black flex flex-col gap-4 shrink-0">
                @for (bloco of blocos(); track $index) {
                    @if (bloco.tipo === 'codigo' && bloco.linguagem === 'mermaid') {
                        <bee-mermaid class="shrink-0" [diagrama]="bloco.conteudo" />
                    } @else if (bloco.tipo === 'codigo') {
                        <bee-code-editor class="w-full shrink-0" [class]="alturaCodigo()" [value]="bloco.conteudo" [language]="bloco.linguagem" [readOnly]="true" />
                    } @else {
                        <div class="licao-conteudo" [innerHTML]="bloco.conteudo"></div>
                    }
                }
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
            </div>

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
        IconComponent, ButtonComponent, TextComponent, CodeEditorComponent, MermaidComponent
    ]
})
export class DesafioLicaoComponent {
    private readonly buscarService = inject(BuscarLicaoService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly sanitizer = inject(DomSanitizer);
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

    readonly blocos = computed<BlocoLicao[]>(() => {
        const markdown = this.licaoService.licao()?.conteudoMarkdown;
        if (!markdown) return [];

        return marked.lexer(markdown).map((token: Token): BlocoLicao => {
            if (token.type === 'code') {
                return { tipo: 'codigo', linguagem: token.lang || 'plaintext', conteudo: token.text };
            }
            return { tipo: 'html', conteudo: this.sanitizer.bypassSecurityTrustHtml(marked.parser([token])) };
        });
    });

    private readonly _carregarDados = effect(() => {
        const desafio = this.buscarService.data();
        if (!desafio) return;
        this.licaoService.iniciar(desafio);
        this.chegouAoFim.set(false);
    });

    private readonly _observarFim = effect(() => {
        this.blocos();
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
