import { signal } from "@angular/core";

const INTERVALO_MIN_MS = 50;
const epoch = performance.now();

/** Instante (ms) compartilhado por todas as camadas de todas as abelhas renderizadas. */
export const relogioAbelha = signal(0);

let rafId: number | null = null;
let assinantes = 0;
let ultimoUpdate = 0;

/**
 * Liga (ou reaproveita) o relógio compartilhado que sincroniza a animação das camadas
 * de abelha. Todas as camadas leem o mesmo `relogioAbelha()`, então, como os GIFs têm a
 * mesma duração de loop, todas ficam sempre exibindo o mesmo índice de quadro — mesmo que
 * tenham terminado de carregar em momentos diferentes.
 */
export function iniciarRelogioAbelha(): () => void {
    assinantes++;

    if (rafId === null) {
        const tick = () => {
            const agora = performance.now() - epoch;
            if (agora - ultimoUpdate >= INTERVALO_MIN_MS) {
                ultimoUpdate = agora;
                relogioAbelha.set(agora);
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
    }

    let parado = false;
    return () => {
        if (parado) return;
        parado = true;
        assinantes--;
        if (assinantes <= 0 && rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };
}
