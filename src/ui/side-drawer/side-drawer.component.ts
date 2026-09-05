import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    OnDestroy,
    effect,
    input,
    model,
    output,
    signal,
} from '@angular/core';

/**
 * Drawer lateral (desliza da direita), mesmo princípio de montagem/animação do `bee-bottom-drawer`
 * mas sem o gesto de arrastar — fecha por clique no backdrop ou tecla Escape.
 */
@Component({
    selector: 'bee-side-drawer',
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
          (transitionend)="onTransitionEnd()"
          class="absolute inset-y-0 right-0 flex h-full w-full max-w-xs flex-col border-l-2 border-black bg-neutral-100 shadow-2xl transition-transform duration-300 ease-out"
          [class.translate-x-0]="visible()"
          [class.translate-x-full]="!visible()"
        >
          @if (title()) {
            <div class="shrink-0 border-b-2 border-black px-4 py-3">
              <h2 class="text-base font-semibold text-balance">
                {{ title() }}
              </h2>
            </div>
          }

          <!-- Conteúdo rolável -->
          <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
})
export class SideDrawerComponent implements OnDestroy {
    /** Controla abertura/fechamento — `model()` pra suportar `[(open)]` e permitir o próprio drawer se fechar. */
    open = model.required<boolean>();
    /** Título opcional exibido no topo do drawer. */
    title = input<string>();

    /** Emitido quando o drawer fecha (backdrop ou Escape). */
    closed = output<void>();

    mounted = signal(false);
    visible = signal(false);

    private previousBodyOverflow = '';

    constructor() {
        effect(() => {
            if (this.open()) this.mounted.set(true);
        });

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

        effect(() => {
            if (this.mounted()) {
                this.previousBodyOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = this.previousBodyOverflow;
            }
        });
    }

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

    onTransitionEnd(): void {
        if (!this.open()) this.mounted.set(false);
    }

    private close(): void {
        this.open.set(false);
        this.closed.emit();
    }
}
