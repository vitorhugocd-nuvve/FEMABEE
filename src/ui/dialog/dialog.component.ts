import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  booleanAttribute,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';

/**
 * Modal central (mesmo princípio de montagem/animação do `bee-side-drawer`/`bee-bottom-drawer`:
 * backdrop + painel, fecha por clique fora ou Escape), mas o painel fica centralizado na tela
 * em vez de deslizar de uma borda.
 */
@Component({
  selector: 'bee-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
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

        <!-- Painel -->
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <!-- Sem transform (ex.: scale) aqui: um transform ativo vira containing block pra
               position:fixed dos descendentes, quebrando drawers/dialogs aninhados no conteúdo. -->
          <div
            (transitionend)="onTransitionEnd()"
            class="flex max-h-[90dvh] w-full flex-col transition-opacity duration-300 ease-out p-0.5"
            [class]="chromeClasses()"
            [class.opacity-100]="visible()"
            [class.opacity-0]="!visible()"
          >
            @if (title()) {
              <div class="shrink-0 px-2 py-1 flex items-center justify-between gap-2 bg-gradient-to-r from-orange-600 to-amber-400">
                <h2 class="text-base font-semibold text-balance text-white!">
                  {{ title() }}
                </h2>
                <button bee-button size="small" (click)="onBackdropClick()" class="shrink-0" aria-label="Fechar">&nbsp;✕&nbsp;</button>
              </div>
            }

            <!-- Conteúdo -->
            <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <ng-content></ng-content>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class DialogComponent implements OnDestroy {
  /** Controla abertura/fechamento — `model()` pra suportar `[(open)]` e permitir o próprio diálogo se fechar. */
  open = model.required<boolean>();
  /** Título opcional exibido no topo do diálogo. */
  title = input<string>();
  /** Sem o painel/moldura padrão (branco, bordado, com barra de título) — pro conteúdo definir sua própria aparência (ex.: a Enciclopédia, que já é a imagem de um livro). */
  bare = input(false, { transform: booleanAttribute });

  protected readonly chromeClasses = computed(() =>
    this.bare() ? '' : 'max-w-3xl border-2 border-black bg-neutral-100 shadow-2xl'
  );

  /** Emitido quando o diálogo fecha (backdrop, X ou Escape). */
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
        // Fallback: `transitionend` nem sempre dispara (ex.: transição interrompida por abrir/
        // fechar rápido demais) — sem isso, o overlay fica montado pra sempre, invisível mas
        // ainda bloqueando cliques na tela inteira.
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
