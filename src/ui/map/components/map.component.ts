import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';

import type { MapActionData, TileSize } from '../map.models';
import { MapCameraService } from '../services/map-camera.service';
import { MapTileService } from '../services/map-tile.service';
import { MapInteractionService } from '../services/map-interaction.service';
import { BeeMapActionComponent } from './map-action.component';
import { TAMANHO_TILE } from '../../../app/core/constants/tile';

/**
 * Componente de mapa com zoom, pan, e suporte a ações posicionadas em tiles.
 *
 * Providers: os três serviços são fornecidos aqui (escopo de instância),
 * portanto cada <app-map> tem seu próprio estado isolado.
 *
 * Uso básico:
 * ```html
 * <app-map [image]="url" [actions]="actions" (actionClick)="onAction($event)" />
 * ```
 *
 * Uso avançado (ações como filhos):
 * ```html
 * <app-map [image]="url">
 *   <app-map-action [x]="2" [y]="3" label="Ponto A" (actionClick)="..." />
 * </app-map>
 * ```
 */
@Component({
  selector: 'bee-map',
  standalone: true,
  imports: [NgStyle, NgClass, BeeMapActionComponent],
  providers: [MapCameraService, MapTileService, MapInteractionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #viewport
      class="map-viewport"
      [ngClass]="{
        'map-viewport--grab': interactive() && !interaction.isDragging,
        'map-viewport--grabbing': interactive() && interaction.isDragging,
        'map-viewport--static': !interactive()
      }"
      [ngStyle]="{ height: viewportHeight() }"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerUp($event)"
      (pointerleave)="onPointerUp($event)"
    >
      <!-- Mundo: imagem + ações, tudo escala/desloca junto via transform -->
      <div class="map-world" [ngStyle]="worldStyle()">
        <img
          #mapImage
          [src]="image()"
          [alt]="alt()"
          [ngStyle]="imageStyle()"
          draggable="false"
          class="map-image"
          (load)="onImageLoad($event)"
        />

        @if (naturalSize()) {
          <!-- Ações via prop -->
          @for (action of actions(); track action.id ?? $index) {
            <bee-map-action
              [x]="action.x"
              [y]="action.y"
              [label]="action.label"
              [color]="action.color ?? defaultActionColor"
              [anchor]="action.anchor ?? 'center'"
              [className]="action.className ?? ''"
              (actionClick)="onActionClick(action, $index)"
            />
          }

          <!-- Ações via content projection (<app-map-action> como filhos) -->
          <ng-content />
        }
      </div>

      <!-- Controles flutuantes -->
      @if (showControls() && interactive()) {
        <div class="map-controls">
          <button
            type="button"
            class="map-controls__btn"
            aria-label="Aproximar"
            (click)="camera.zoomBy(1.25)"
          >+</button>

          <button
            type="button"
            class="map-controls__btn"
            aria-label="Afastar"
            (click)="camera.zoomBy(0.8)"
          >−</button>

          <button
            type="button"
            class="map-controls__btn map-controls__btn--pct"
            aria-label="Recentralizar"
            (click)="camera.reset()"
          >{{ scalePercent() }}%</button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .map-viewport {
      position: relative;
      width: 100%;
      overflow: hidden;
      background: #dae0ea;
      user-select: none;
      touch-action: none;
      overscroll-behavior: none;
    }

    .map-viewport--grab    { cursor: grab; }
    .map-viewport--grabbing { cursor: grabbing; }
    .map-viewport--static  { cursor: default; }

    .map-world {
      position: absolute;
      left: 0;
      top: 0;
      transform-origin: top left;
    }

    .map-image {
      display: block;
      image-rendering: pixelated;
    }

    /* Controles */
    .map-controls {
      position: absolute;
      bottom: 12px;
      left: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      border-radius: 10px;
      background: rgba(0,0,0,.7);
      backdrop-filter: blur(6px);
      padding: 6px;
      box-shadow: 0 8px 24px rgba(0,0,0,.24);
    }

    .map-controls__btn {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #fff;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
      transition: background 120ms ease;
    }

    .map-controls__btn:hover {
      background: rgba(255,255,255,.15);
    }

    .map-controls__btn--pct {
      font-size: 11px;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .map-controls {
        bottom: 10px;
        left: 10px;
        padding: 8px;
        gap: 8px;
      }

      .map-controls__btn {
        width: 48px;
        height: 48px;
      }
    }
  `],
})
export class BeeMapComponent implements OnInit, OnDestroy {
  @ViewChild('viewport', { static: true })
  private viewportEl!: ElementRef<HTMLDivElement>;

  protected readonly camera = inject(MapCameraService);
  private readonly tileService = inject(MapTileService);
  protected readonly interaction = inject(MapInteractionService);

  // ── Inputs ─────────────────────────────────────────────────────────
  readonly image = input.required<string>();
  readonly tileSize = input<number | TileSize>(TAMANHO_TILE);
  readonly size = input<{ x: number; y: number } | null>(null);
  readonly actions = input<MapActionData[]>([]);
  readonly initialZoom = input<number>(1);
  readonly minZoom = input<number>(0.25);
  readonly maxZoom = input<number>(4);
  readonly interactive = input<boolean>(true);
  readonly showControls = input<boolean>(true);
  readonly alt = input<string>('Mapa');
  readonly viewportHeight = input<string>('500px');

  // ── Outputs ───────────────────────────────────────────────────────
  readonly actionClick = output<{ action: MapActionData; index: number }>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly naturalSize = signal<{ width: number; height: number } | null>(null);

  protected readonly defaultActionColor = 'var(--color-primary, #3b82f6)';

  // ── Computed styles ───────────────────────────────────────────────
  protected readonly scalePercent = computed(() =>
    Math.round(this.camera.scale() * 100)
  );

  protected readonly worldStyle = computed(() => {
    const { x, y } = this.camera.offset();
    const s = this.camera.scale();
    const nat = this.naturalSize();
    return {
      width: nat ? `${nat.width}px` : 'auto',
      height: nat ? `${nat.height}px` : 'auto',
      transform: `translate3d(${x}px, ${y}px, 0) scale(${s})`,
      transition: this.interaction.isDragging ? 'none' : 'transform 80ms ease-out',
    };
  });

  protected readonly imageStyle = computed(() => {
    const nat = this.naturalSize();
    return nat
      ? { width: `${nat.width}px`, height: `${nat.height}px` }
      : {};
  });

  // ── Lifecycle ──────────────────────────────────────────────────────
  private resizeObserver?: ResizeObserver;
  private wheelHandler?: (e: WheelEvent) => void;

  constructor() {
    // Sincroniza inputs dos tiles com o serviço via effects
    effect(() => {
      this.tileService.setTileSize(this.tileSize());
      this.tileService.setTileCount(this.size());
    });

    effect(() => {
      this.camera.configure({
        minZoom: this.minZoom(),
        maxZoom: this.maxZoom(),
        initialZoom: this.initialZoom(),
      });
    });
  }

  ngOnInit(): void {
    const el = this.viewportEl.nativeElement;

    // Viewport size inicial
    this.camera.setViewportSize(el.clientWidth, el.clientHeight);

    // ResizeObserver para re-clamp quando o container muda
    this.resizeObserver = new ResizeObserver(() => {
      this.camera.setViewportSize(el.clientWidth, el.clientHeight);
      this.camera.setView(this.camera.scale(), this.camera.offset());
    });
    this.resizeObserver.observe(el);

    // Wheel com { passive: false } para permitir preventDefault
    if (this.interactive()) {
      this.wheelHandler = (e: WheelEvent) => {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        this.interaction.onWheel(e.deltaY, e.clientX - rect.left, e.clientY - rect.top);
      };
      el.addEventListener('wheel', this.wheelHandler, { passive: false });
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    const el = this.viewportEl.nativeElement;
    if (this.wheelHandler) {
      el.removeEventListener('wheel', this.wheelHandler);
    }
  }

  // ── Event handlers ────────────────────────────────────────────────
  protected onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    const size = { width: img.naturalWidth, height: img.naturalHeight };
    this.naturalSize.set(size);
    this.tileService.setNaturalSize(size);
    this.camera.setNaturalSize(size);
    this.camera.reset();
  }

  protected onPointerDown(event: PointerEvent): void {
    if (!this.interactive()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const rect = this.viewportEl.nativeElement.getBoundingClientRect();
    this.interaction.onPointerDown(
      event.clientX - rect.left,
      event.clientY - rect.top,
      event.pointerId,
      event.pointerType,
    );
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.interactive()) return;
    const rect = this.viewportEl.nativeElement.getBoundingClientRect();
    this.interaction.onPointerMove(
      event.clientX - rect.left,
      event.clientY - rect.top,
      event.pointerId,
    );
  }

  protected onPointerUp(event: PointerEvent): void {
    try {
      (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    } catch { /* ignore */ }
    this.interaction.onPointerUp(event.pointerId);
  }

  protected onActionClick(action: MapActionData, index: number): void {
    // Ignora se foi um arraste
    if (this.interaction.totalMoved > 4) return;
    action.onClick?.();
    this.actionClick.emit({ action, index });
  }
}