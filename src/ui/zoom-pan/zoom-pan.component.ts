import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core";

const ESCALA_MINIMA = 1;
const ESCALA_MAXIMA = 4;

type Ponteiro = { x: number; y: number };

/**
 * Wrapper reutilizável de pinça-pra-zoom + arrastar-pra-navegar (touch), e roda do
 * mouse + arrastar (desktop) — via pointer events, sem lib externa. Mesmo princípio
 * artesanal do pan/zoom do `bee-map`, só que autocontido num único componente.
 */
@Component({
    selector: 'bee-zoom-pan',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="h-full w-full overflow-hidden touch-none select-none" (wheel)="onWheel($event)">
        <div
            class="h-full w-full flex items-center justify-center touch-none"
            [style.transform]="transform()"
            (pointerdown)="onPointerDown($event)"
            (pointermove)="onPointerMove($event)"
            (pointerup)="onPointerUp($event)"
            (pointercancel)="onPointerUp($event)">
            <ng-content />
        </div>
    </div>
    `,
    host: { class: 'block' }
})
export class ZoomPanComponent {
    private readonly ponteiros = new Map<number, Ponteiro>();
    private distanciaInicial = 0;
    private escalaInicial = 1;
    private ultimoPan: Ponteiro | undefined;

    protected readonly escala = signal(1);
    protected readonly translacaoX = signal(0);
    protected readonly translacaoY = signal(0);

    protected readonly transform = computed(() =>
        `translate(${this.translacaoX()}px, ${this.translacaoY()}px) scale(${this.escala()})`
    );

    onPointerDown(e: PointerEvent): void {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        this.ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (this.ponteiros.size === 2) {
            const [a, b] = [...this.ponteiros.values()];
            this.distanciaInicial = this.distancia(a, b);
            this.escalaInicial = this.escala();
        } else if (this.ponteiros.size === 1) {
            this.ultimoPan = { x: e.clientX, y: e.clientY };
        }
    }

    onPointerMove(e: PointerEvent): void {
        if (!this.ponteiros.has(e.pointerId)) return;
        this.ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (this.ponteiros.size === 2) {
            const [a, b] = [...this.ponteiros.values()];
            if (this.distanciaInicial > 0) {
                const novaEscala = (this.escalaInicial * this.distancia(a, b)) / this.distanciaInicial;
                this.escala.set(this.clamp(novaEscala));
            }
            return;
        }

        if (this.ponteiros.size === 1 && this.ultimoPan) {
            this.translacaoX.update(x => x + (e.clientX - this.ultimoPan!.x));
            this.translacaoY.update(y => y + (e.clientY - this.ultimoPan!.y));
            this.ultimoPan = { x: e.clientX, y: e.clientY };
        }
    }

    onPointerUp(e: PointerEvent): void {
        this.ponteiros.delete(e.pointerId);
        const restantes = [...this.ponteiros.values()];
        this.ultimoPan = restantes.length === 1 ? restantes[0] : undefined;
    }

    onWheel(e: WheelEvent): void {
        e.preventDefault();
        const fator = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        this.escala.update(atual => this.clamp(atual * fator));
    }

    private distancia(a: Ponteiro, b: Ponteiro): number {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    private clamp(escala: number): number {
        return Math.min(ESCALA_MAXIMA, Math.max(ESCALA_MINIMA, escala));
    }
}
