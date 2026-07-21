import {
    Component,
    inject,
    input,
    output,
    computed,
    signal,
    afterRenderEffect,
    ElementRef,
    viewChild,
    ChangeDetectionStrategy,
} from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';
import { MapTileService } from '../services/map-tile.service';

/**
 * Marcador posicionado sobre um tile do mapa.
 * Deve ser usado como filho de <map-component> para ter acesso
 * ao MapTileService provido pelo componente pai.
 *
 * Uso simples (dot padrão):
 *   <bee-map-action [x]="2" [y]="3" label="Ponto A" (actionClick)="..." />
 *
 * Uso personalizado (conteúdo projetado substitui o dot):
 *   <bee-map-action [x]="2" [y]="3" (actionClick)="...">
 *     <my-icon />
 *   </bee-map-action>
 */
@Component({
    selector: 'bee-map-action',
    standalone: true,
    imports: [NgStyle, NgClass],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div
      class="map-action"
      [ngStyle]="containerStyle()"
      [ngClass]="className()"
    >
      <button
        type="button"
        [disabled]="!hasClick()"
        [attr.aria-label]="label() ?? 'Ação em ' + x() + ', ' + y()"
        [ngClass]="buttonClass()"
        [ngStyle]="hasProjectedContent() ? customButtonStyle() : buttonStyle()"
        (click)="onClick()"
        (pointerdown)="$event.stopPropagation()"
      >
        <!--
          Wrapper com #slotWrapper: o viewChild lê os childNodes daqui,
          garantindo que a detecção não dependa de filhos soltos no host.
          ng-content sempre no DOM; o dot some condicionalmente.
        -->
        <span #slotWrapper class="map-action__slot"><ng-content /></span>

        @if (!hasProjectedContent()) {
          <span class="map-action__dot" aria-hidden="true"></span>
        }
      </button>

      @if (label()) {
        <span class="map-action__label">{{ label() }}</span>
      }
    </div>
  `,
    styles: [`
    .map-action {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -50%);
    }

    .map-action__btn {
      position: relative;
      display: grid;
      place-items: center;
      border-radius: 50%;
      border: none;
      outline-offset: 2px;
      cursor: default;
      box-shadow: 0 0 0 2px rgba(255,255,255,.8), 0 2px 6px rgba(0,0,0,.35);
      transition: transform 120ms ease;
    }

    .map-action__btn--interactive {
      cursor: pointer;
    }

    .map-action__btn--interactive:hover {
      transform: scale(1.1);
    }

    .map-action__btn--interactive:active {
      transform: scale(0.95);
    }

    .map-action__btn--custom {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
    }

    .map-action__slot {
      display: contents;
    }

    .map-action__dot {
      display: block;
      width: 33%;
      height: 33%;
      border-radius: 50%;
      background: rgba(255,255,255,.9);
    }

    .map-action__label {
      pointer-events: none;
      margin-top: 4px;
      white-space: nowrap;
      border-radius: 3px;
      background: rgba(0,0,0,.75);
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 500;
      line-height: 1;
      color: #fff;
    }
  `],
})
export class BeeMapActionComponent {
    private readonly tileService = inject(MapTileService);

    // ── Inputs ────────────────────────────────────────────────────────────
    readonly x = input.required<number>();
    readonly y = input.required<number>();
    readonly label = input<string | undefined>(undefined);
    readonly color = input<string>('var(--color-primary, #3b82f6)');
    readonly anchor = input<'tile' | 'center'>('center');
    readonly className = input<string>('');
    readonly interactive = input<boolean>(true);

    // ── Outputs ───────────────────────────────────────────────────────────
    readonly actionClick = output<void>();

    // ── Slot detection ────────────────────────────────────────────────────
    private readonly slotWrapper = viewChild<ElementRef<HTMLElement>>('slotWrapper');
    readonly hasProjectedContent = signal(false);

    constructor() {
        afterRenderEffect(() => {
            const wrapper = this.slotWrapper()?.nativeElement;
            if (!wrapper) return;

            // Filtra nós de texto vazios (whitespace entre tags) e comentários
            const hasContent = Array.from(wrapper.childNodes).some(
                node =>
                    node.nodeType === Node.ELEMENT_NODE ||
                    (node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim()),
            );

            this.hasProjectedContent.set(hasContent);
        });
    }

    // ── Computed ─────────────────────────────────────────────────────────
    protected readonly hasClick = computed(() => this.interactive());

    protected readonly containerStyle = computed(() => {
        const { width, height } = this.tileService.tileSize();
        const { left, top } = this.tileService.tileToPixel(this.x(), this.y());
        const offsetX = this.anchor() === 'center' ? width / 2 : 0;
        const offsetY = this.anchor() === 'center' ? height / 2 : 0;

        return {
            left: `${left + offsetX}px`,
            top:  `${top  + offsetY}px`,
        };
    });

    /** Estilos do botão no modo padrão (dot colorido, tamanho baseado no tile). */
    protected readonly buttonStyle = computed(() => {
        const { width, height } = this.tileService.tileSize();
        return {
            width:           `${Math.max(width  * 0.8, 14)}px`,
            height:          `${Math.max(height * 0.8, 14)}px`,
            backgroundColor: this.color(),
        };
    });

    /** Estilos do botão no modo customizado (sem dimensões impostas). */
    protected readonly customButtonStyle = computed(() => ({
        backgroundColor: 'transparent',
        width:  'auto',
        height: 'auto',
    }));

    protected readonly buttonClass = computed(() => ({
        'map-action__btn':              true,
        'map-action__btn--interactive': this.hasClick(),
        'map-action__btn--custom':      this.hasProjectedContent(),
    }));

    onClick(): void {
        this.actionClick.emit();
    }
}