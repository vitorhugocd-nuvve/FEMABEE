import { Component, DestroyRef, ElementRef, effect, inject, input, signal, viewChild } from "@angular/core";
import { DescriptionComponent } from "../typography/description.component";
import { DialogComponent } from "../dialog/dialog.component";
import { ZoomPanComponent } from "../zoom-pan/zoom-pan.component";

declare const mermaid: {
    initialize(config: Record<string, unknown>): void;
    render(id: string, texto: string): Promise<{ svg: string }>;
};

const CDN_MERMAID = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";

let promessaCarregamento: Promise<void> | undefined;
let proximoId = 0;

/** Carrega o Mermaid via CDN em runtime (mesmo princípio do Monaco e do bee-icon) — só baixa quando um diagrama é realmente renderizado. */
function carregarMermaid(): Promise<void> {
    if (!promessaCarregamento) {
        promessaCarregamento = new Promise<void>((resolve, reject) => {
            if (typeof mermaid !== 'undefined') { resolve(); return; }
            const script = document.createElement('script');
            script.src = CDN_MERMAID;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Falha ao carregar o Mermaid'));
            document.head.appendChild(script);
        }).then(() => {
            mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
        });
    }
    return promessaCarregamento;
}

/**
 * Renderiza um diagrama UML/Mermaid a partir do texto (ex.: `classDiagram ...`).
 * Tocar no diagrama abre uma visualização em tela cheia com pinça-zoom/arraste
 * (`bee-zoom-pan`) — no tamanho normal o SVG costuma ficar pequeno demais pra
 * ler no mobile.
 */
@Component({
    selector: 'bee-mermaid',
    template: `
    @if (carregando()) {
        <bee-description>Carregando diagrama...</bee-description>
    }
    <div #container class="w-full overflow-auto cursor-zoom-in" (click)="abrirZoom()"></div>

    <bee-dialog [(open)]="zoomAberto" title="Diagrama">
        <bee-zoom-pan class="block w-full h-[75dvh]">
            <div #containerZoom></div>
        </bee-zoom-pan>
    </bee-dialog>
    `,
    host: { class: 'block w-full' },
    imports: [DescriptionComponent, DialogComponent, ZoomPanComponent]
})
export class MermaidComponent {
    readonly diagrama = input.required<string>();

    protected readonly carregando = signal(true);
    protected readonly zoomAberto = signal(false);

    private readonly svgAtual = signal('');
    private readonly containerRef = viewChild('container', { read: ElementRef<HTMLDivElement> });
    private readonly containerZoomRef = viewChild('containerZoom', { read: ElementRef<HTMLDivElement> });

    constructor() {
        const destroyRef = inject(DestroyRef);
        let destruido = false;
        destroyRef.onDestroy(() => { destruido = true; });

        effect(() => {
            const diagrama = this.diagrama();
            const container = this.containerRef()?.nativeElement;
            if (!container) return;

            this.carregando.set(true);
            carregarMermaid()
                .then(() => mermaid.render(`mermaid-${proximoId++}`, diagrama))
                .then(({ svg }) => {
                    if (destruido) return;
                    this.svgAtual.set(svg);
                    this.carregando.set(false);
                })
                .catch(() => {
                    if (destruido) return;
                    this.svgAtual.set('');
                    this.carregando.set(false);
                });
        });

        // Espelha o SVG renderizado tanto na prévia inline quanto na cópia do dialog de zoom.
        effect(() => {
            const svg = this.svgAtual();
            const container = this.containerRef()?.nativeElement;
            if (container) container.innerHTML = svg;
        });

        effect(() => {
            const svg = this.svgAtual();
            const containerZoom = this.containerZoomRef()?.nativeElement;
            if (containerZoom) containerZoom.innerHTML = svg;
        });
    }

    protected abrirZoom(): void {
        if (!this.svgAtual()) return;
        this.zoomAberto.set(true);
    }
}
