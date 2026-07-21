import { Injectable, signal, computed } from '@angular/core';
import type { CameraState, NaturalSize } from '../map.models';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Responsabilidade única: toda a matemática da câmera —
 * scale, offset, clamp de bordas, zoom centrado e pan.
 *
 * Não conhece o DOM; recebe as dimensões do viewport e da imagem
 * via métodos, e expõe o estado como signals.
 */
@Injectable()
export class MapCameraService {
    // ── Config ──────────────────────────────────────────────────────────
    private _minZoom = 0.25;
    private _maxZoom = 4;
    private _initialZoom = 1;

    // ── Estado reativo ───────────────────────────────────────────────────
    private readonly _scale = signal(1);
    private readonly _offset = signal({ x: 0, y: 0 });
    private readonly _naturalSize = signal<NaturalSize | null>(null);
    private readonly _viewportSize = signal({ vw: 0, vh: 0 });

    readonly scale = this._scale.asReadonly();
    readonly offset = this._offset.asReadonly();

    /** Escala mínima efetiva: garante que a imagem inteira caiba no viewport. */
    readonly minScale = computed<number>(() => {
        const nat = this._naturalSize();
        if (!nat) return this._minZoom;
        const { vw, vh } = this._viewportSize();
        if (!vw || !vh) return this._minZoom;
        return Math.max(this._minZoom, Math.min(vw / nat.width, vh / nat.height));
    });

    // ── Configuração ─────────────────────────────────────────────────────

    configure(opts: { minZoom?: number; maxZoom?: number; initialZoom?: number }): void {
        if (opts.minZoom !== undefined) this._minZoom = opts.minZoom;
        if (opts.maxZoom !== undefined) this._maxZoom = opts.maxZoom;
        if (opts.initialZoom !== undefined) this._initialZoom = opts.initialZoom;
    }

    setNaturalSize(size: NaturalSize | null): void {
        this._naturalSize.set(size);
    }

    setViewportSize(vw: number, vh: number): void {
        this._viewportSize.set({ vw, vh });
    }

    // ── Câmera ────────────────────────────────────────────────────────────

    /**
     * Aplica uma nova câmera passando sempre pelo clamp de escala e bordas.
     */
    setView(scale: number, offset: { x: number; y: number }): void {
        const clamped = this._clamp(scale, offset);
        this._scale.set(clamped.scale);
        this._offset.set(clamped.offset);
    }

    /**
     * Centraliza o mapa na menor escala que permite visualizar a imagem inteira.
     */
    reset(): void {
        const nat = this._naturalSize();
        if (!nat) return;
        const { vw, vh } = this._viewportSize();
        const s = this.minScale();
        const scaledW = nat.width * s;
        const scaledH = nat.height * s;
        this.setView(s, { x: (vw - scaledW) / 2, y: (vh - scaledH) / 2 });
    }

    /**
     * Zoom para uma escala específica, centrado em um ponto do viewport (px).
     */
    zoomTo(scale: number, cx: number, cy: number): void {
        const prev = this._scale();
        const next = clamp(scale, this.minScale(), this._maxZoom);
        if (next === prev) return;
        const ratio = next / prev;
        const o = this._offset();
        this.setView(next, {
            x: cx - (cx - o.x) * ratio,
            y: cy - (cy - o.y) * ratio,
        });
    }

    /**
     * Zoom multiplicativo centrado em um ponto do viewport (px).
     */
    zoomAt(factor: number, cx: number, cy: number): void {
        this.zoomTo(this._scale() * factor, cx, cy);
    }

    /**
     * Zoom multiplicativo centrado no centro do viewport.
     */
    zoomBy(factor: number): void {
        const { vw, vh } = this._viewportSize();
        this.zoomAt(factor, vw / 2, vh / 2);
    }

    /**
     * Pan absoluto: move o offset para a posição calculada a partir de uma
     * origem e um delta arrastado.
     */
    pan(originX: number, originY: number, dx: number, dy: number): void {
        this.setView(this._scale(), { x: originX + dx, y: originY + dy });
    }

    // ── Privado ───────────────────────────────────────────────────────────

    private _clamp(s: number, o: { x: number; y: number }): CameraState {
        const nat = this._naturalSize();
        if (!nat) return { scale: s, offset: o };

        const { vw, vh } = this._viewportSize();
        const scale = clamp(s, this.minScale(), this._maxZoom);
        const scaledW = nat.width * scale;
        const scaledH = nat.height * scale;

        const x = scaledW <= vw ? (vw - scaledW) / 2 : clamp(o.x, vw - scaledW, 0);
        const y = scaledH <= vh ? (vh - scaledH) / 2 : clamp(o.y, vh - scaledH, 0);

        return { scale, offset: { x, y } };
    }
}