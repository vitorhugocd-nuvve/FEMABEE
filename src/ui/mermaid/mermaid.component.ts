import { Component, DestroyRef, ElementRef, effect, inject, input, signal, viewChild } from "@angular/core";
import { DescriptionComponent } from "../typography/description.component";

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

/** Renderiza um diagrama UML/Mermaid a partir do texto (ex.: `classDiagram ...`). */
@Component({
    selector: 'bee-mermaid',
    template: `
    @if (carregando()) {
        <bee-description>Carregando diagrama...</bee-description>
    }
    <div #container class="w-full overflow-auto"></div>
    `,
    host: { class: 'block w-full' },
    imports: [DescriptionComponent]
})
export class MermaidComponent {
    readonly diagrama = input.required<string>();

    protected readonly carregando = signal(true);
    private readonly containerRef = viewChild('container', { read: ElementRef<HTMLDivElement> });

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
                    container.innerHTML = svg;
                    this.carregando.set(false);
                })
                .catch(() => {
                    if (destruido) return;
                    container.innerHTML = '';
                    this.carregando.set(false);
                });
        });
    }
}
