import { Injectable, signal, computed } from '@angular/core';
import type { TileSize, NaturalSize } from '../map.models';

/**
 * Responsabilidade única: resolver o tamanho de um tile e converter
 * coordenadas de tile para pixels no espaço da imagem natural.
 *
 * Recebe o estado natural da imagem via `setNaturalSize()`, que é
 * chamado pelo MapComponent assim que a imagem carrega.
 */
@Injectable()
export class MapTileService {
    private readonly _tileSize = signal<TileSize>({ width: 16, height: 16 });
    private readonly _naturalSize = signal<NaturalSize | null>(null);
    private readonly _tileCount = signal<{ x: number; y: number } | null>(null);

    /** Tile resolvido (em px da imagem natural, sem zoom). */
    readonly tileSize = computed<TileSize>(() => {
        const nat = this._naturalSize();
        const count = this._tileCount();

        if (count && nat) {
            return {
                width: nat.width / count.x,
                height: nat.height / count.y,
            };
        }

        return this._tileSize();
    });

    /**
     * Configura tileSize a partir de um número (quadrado) ou objeto {w,h}.
     * Chamado pelo MapComponent ao receber os inputs.
     */
    setTileSize(value: number | TileSize): void {
        if (typeof value === 'number') {
            this._tileSize.set({ width: value, height: value });
        } else {
            this._tileSize.set(value);
        }
    }

    /** Informa a contagem de tiles — alternativa ao tileSize explícito. */
    setTileCount(value: { x: number; y: number } | null): void {
        this._tileCount.set(value);
    }

    /** Atualizado pelo MapComponent após onload da imagem. */
    setNaturalSize(size: NaturalSize | null): void {
        this._naturalSize.set(size);
    }

    /**
     * Converte coordenadas de tile para pixels no espaço da imagem natural.
     * Não leva o zoom em conta — o zoom é aplicado via CSS transform no mundo.
     */
    tileToPixel(x: number, y: number): { left: number; top: number } {
        const { width, height } = this.tileSize();
        return { left: x * width, top: y * height };
    }
}