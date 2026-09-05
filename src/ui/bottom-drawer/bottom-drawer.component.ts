import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    ViewChild,
    effect,
    input,
    model,
    output,
    signal,
} from '@angular/core';

// Velocidade (px/ms) de "flick" para baixo que fecha o drawer instantaneamente.
const VELOCITY_TO_CLOSE = 0.5;

@Component({
    selector: 'bee-bottom-drawer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    @if (mounted()) {
      <div class="fixed inset-0 z-50" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div
          (click)="onBackdropClick()"
          class="absolute inset-0 bg-black/50 transition-opacity duration-300"
          [class.opacity-100]="visible()"
          [class.opacity-0]="!visible()"
          aria-hidden="true"
        ></div>

        <!-- Sheet -->
        <div
          #sheet
          (transitionend)="onTransitionEnd()"
          class="absolute inset-x-0 bottom-0 mx-auto flex max-h-[90dvh] w-full max-w-md flex-col border border-black bg-neutral-100 shadow-2xl transition-transform duration-300 ease-out"
          [class.translate-y-0]="visible()"
          [class.translate-y-full]="!visible()"
        >
          <!-- Área "pegável" para o arrasto (handle + header) -->
          <div
            (pointerdown)="onPointerDown($event)"
            (pointermove)="onPointerMove($event)"
            (pointerup)="onPointerUp()"
            (pointercancel)="onPointerUp()"
            class="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing"
          >
            <div class="flex justify-center pb-1 pt-3">
              <span class="h-1.5 w-18 bg-neutral-700/30 border border-black"></span>
            </div>
            @if (title()) {
              <div class="border-b border-border px-4 pb-3 pt-1">
                <h2 class="text-center text-base font-semibold text-foreground text-balance">
                  {{ title() }}
                </h2>
              </div>
            }
          </div>

          <!-- Conteúdo rolável -->
          <div
            #content
            class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
          >
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
})
export class BottomDrawerComponent implements OnDestroy {
    /**
     * Controla abertura/fechamento do drawer.
     * É um `model()` (e não `input()`) de propósito: assim o componente pode
     * fechar a si mesmo escrevendo `this.open.set(false)` direto, sem depender
     * do pai escutar um evento e atualizar o estado manualmente. Suporta
     * two-way binding com `[(open)]="isOpen"`.
     */
    open = model.required<boolean>();
    /** Título opcional exibido no topo do drawer. */
    title = input<string>();
    /**
     * Fração da altura arrastada (0-1) a partir da qual o drawer fecha ao soltar.
     * Padrão: 0.4 (arrastar 40% da altura fecha).
     */
    closeThreshold = input<number>(0.4);

    /**
     * Emitido quando o drawer fecha (backdrop, Escape, drag ou flick).
     * Opcional — use apenas se precisar reagir ao fechamento além do
     * two-way binding de `open` (ex: analytics, side-effects).
     */
    closed = output<void>();

    @ViewChild('sheet') private sheetEl?: ElementRef<HTMLDivElement>;
    @ViewChild('content') private contentEl?: ElementRef<HTMLDivElement>;

    // Controla se o elemento está montado (para animar a saída antes de desmontar).
    mounted = signal(false);
    // Controla o estado "visível" que dispara a transição de entrada.
    visible = signal(false);

    // Estado do arrasto — mantido em campos simples (fora de signals) para
    // evitar re-render/change detection durante o movimento.
    private dragging = false;
    private startY = 0;
    private currentY = 0;
    private lastY = 0;
    private lastTime = 0;
    private velocity = 0;
    // Se o gesto começou com a área de conteúdo já no topo do scroll.
    private canDrag = false;

    private previousBodyOverflow = '';

    constructor() {
        // Monta ao abrir (equivalente ao 1º useEffect do original).
        effect(() => {
            if (this.open()) this.mounted.set(true);
        });

        // Dispara a animação de entrada/saída depois de montar
        // (equivalente ao useLayoutEffect original, com cleanup do rAF).
        effect((onCleanup) => {
            if (!this.mounted()) return;

            if (this.open()) {
                const id = requestAnimationFrame(() => this.visible.set(true));
                onCleanup(() => cancelAnimationFrame(id));
            } else {
                this.visible.set(false);
                // Fallback: `transitionend` nem sempre dispara (ex.: transição interrompida por
                // abrir/fechar rápido demais) — sem isso, o overlay fica montado pra sempre,
                // invisível mas ainda bloqueando cliques na tela inteira.
                const timeoutId = setTimeout(() => this.mounted.set(false), 350);
                onCleanup(() => clearTimeout(timeoutId));
            }
        });

        // Bloqueia o scroll do body enquanto o drawer está montado.
        effect(() => {
            if (this.mounted()) {
                this.previousBodyOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = this.previousBodyOverflow;
            }
        });
    }

    // Fecha ao apertar Escape.
    @HostListener('window:keydown', ['$event'])
    onKeydown(e: KeyboardEvent): void {
        if (this.open() && e.key === 'Escape') {
            this.close();
        }
    }

    ngOnDestroy(): void {
        document.body.style.overflow = this.previousBodyOverflow;
    }

    onBackdropClick(): void {
        this.close();
    }

    onPointerDown(e: PointerEvent): void {
        // Só permite arrastar se o conteúdo estiver no topo do scroll.
        const content = this.contentEl?.nativeElement;
        this.canDrag = !content || content.scrollTop <= 0;

        this.dragging = true;
        this.startY = e.clientY;
        this.currentY = 0;
        this.lastY = e.clientY;
        this.lastTime = performance.now();
        this.velocity = 0;

        const sheet = this.sheetEl?.nativeElement;
        if (sheet) sheet.style.transition = 'none';
    }

    onPointerMove(e: PointerEvent): void {
        if (!this.dragging) return;

        const delta = e.clientY - this.startY;

        // Só arrasta para baixo e apenas se o gesto começou no topo do scroll.
        if (delta <= 0 || !this.canDrag) {
            this.currentY = 0;
            this.applyTransform(0);
            return;
        }

        // Captura o ponteiro na primeira movimentação real para continuar
        // recebendo eventos mesmo se o dedo/cursor sair do elemento.
        const target = e.currentTarget as HTMLElement | null;
        if (target?.hasPointerCapture && !target.hasPointerCapture(e.pointerId)) {
            target.setPointerCapture?.(e.pointerId);
        }

        const now = performance.now();
        const dt = now - this.lastTime || 1;
        this.velocity = (e.clientY - this.lastY) / dt;
        this.lastY = e.clientY;
        this.lastTime = now;

        this.currentY = delta;
        this.applyTransform(delta);
    }

    onPointerUp(): void {
        if (!this.dragging) return;
        this.dragging = false;

        const sheet = this.sheetEl?.nativeElement;
        if (sheet) sheet.style.transition = '';

        const height = sheet?.offsetHeight ?? window.innerHeight;
        const draggedFraction = this.currentY / height;

        const shouldClose =
            this.velocity > VELOCITY_TO_CLOSE || draggedFraction > this.closeThreshold();

        if (shouldClose) {
            this.close();
        } else {
            this.resetTransform();
        }
    }

    // Remove do DOM quando a animação de saída termina.
    onTransitionEnd(): void {
        if (!this.open()) this.mounted.set(false);
    }

    /** Fecha o drawer: atualiza o próprio model e notifica quem estiver ouvindo. */
    private close(): void {
        this.open.set(false);
        this.closed.emit();
    }

    private applyTransform(y: number): void {
        const sheet = this.sheetEl?.nativeElement;
        if (!sheet) return;
        sheet.style.transform = `translateY(${y}px)`;
    }

    private resetTransform(): void {
        const sheet = this.sheetEl?.nativeElement;
        if (!sheet) return;
        sheet.style.transform = '';
    }
}