import { Injectable, inject } from '@angular/core';
import { MapCameraService } from './map-camera.service';

/**
 * Responsabilidade única: interpretar eventos de ponteiro e roda do mouse
 * e traduzir para operações na MapCameraService.
 *
 * Mantém o estado interno do arraste sem poluir o componente.
 */
@Injectable()
export class MapInteractionService {
    private readonly camera = inject(MapCameraService);

    private _dragState: {
        pointerId: number;
        startX: number;
        startY: number;
        originX: number;
        originY: number;
    } | null = null;

    private _activePointers = new Map<number, { x: number; y: number }>();
    private _pinchState: {
        startDistance: number;
        startScale: number;
    } | null = null;

    private _totalMoved = 0;
    private _isDragging = false;

    get isDragging(): boolean {
        return this._isDragging;
    }

    /**
     * Distância total arrastada desde o último pointerdown.
     * Usada pelo componente para distinguir clique de arraste.
     */
    get totalMoved(): number {
        return this._totalMoved;
    }

    onPointerDown(clientX: number, clientY: number, pointerId: number, pointerType?: string): void {
        this._activePointers.set(pointerId, { x: clientX, y: clientY });

        if (this._activePointers.size === 2) {
            this._dragState = null;
            this._isDragging = false;
            this._pinchState = this._createPinchState();
            return;
        }

        if (this._activePointers.size > 2) return;

        if (pointerType === 'touch' || this._activePointers.size === 1) {
            this._totalMoved = 0;
            this._isDragging = true;
            const o = this.camera.offset();
            this._dragState = {
                pointerId,
                startX: clientX,
                startY: clientY,
                originX: o.x,
                originY: o.y,
            };
        }
    }

    onPointerMove(clientX: number, clientY: number, pointerId: number): void {
        this._activePointers.set(pointerId, { x: clientX, y: clientY });

        if (this._activePointers.size >= 2 && this._pinchState) {
            const [first, second] = Array.from(this._activePointers.values());
            const distance = Math.hypot(first.x - second.x, first.y - second.y);
            if (distance > 0) {
                const factor = distance / this._pinchState.startDistance;
                const nextScale = this._pinchState.startScale * factor;
                const midpoint = {
                    x: (first.x + second.x) / 2,
                    y: (first.y + second.y) / 2,
                };
                this.camera.zoomTo(nextScale, midpoint.x, midpoint.y);
            }
            return;
        }

        const d = this._dragState;
        if (!d || d.pointerId !== pointerId) return;
        const dx = clientX - d.startX;
        const dy = clientY - d.startY;
        this._totalMoved = Math.max(this._totalMoved, Math.abs(dx) + Math.abs(dy));
        this.camera.pan(d.originX, d.originY, dx, dy);
    }

    onPointerUp(pointerId: number): void {
        this._activePointers.delete(pointerId);

        if (this._dragState?.pointerId === pointerId) {
            this._dragState = null;
            this._isDragging = false;
        }

        if (this._activePointers.size < 2) {
            this._pinchState = null;
        }

        if (this._activePointers.size === 0) {
            this._dragState = null;
            this._isDragging = false;
            this._pinchState = null;
        }
    }

    onPointerCancel(pointerId: number): void {
        this.onPointerUp(pointerId);
    }

    onWheel(deltaY: number, clientX: number, clientY: number): void {
        const factor = Math.exp(-deltaY * 0.0015);
        this.camera.zoomAt(factor, clientX, clientY);
    }

    private _createPinchState(): { startDistance: number; startScale: number } | null {
        const [first, second] = Array.from(this._activePointers.values());
        if (!first || !second) return null;
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        if (distance <= 0) return null;
        return {
            startDistance: distance,
            startScale: this.camera.scale(),
        };
    }
}