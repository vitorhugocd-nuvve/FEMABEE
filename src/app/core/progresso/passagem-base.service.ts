import { Signal } from "@angular/core";

/**
 * Fachada de uma "carteira" de passagens (ônibus/avião) em cima do saldo real da
 * abelha selecionada (AbelhaEconomiaService) — mantém a mesma API que já existia
 * quando isso era um mock local, pra não mexer nos consumidores (dialogo-gatilho,
 * tela de viagem, contadores do header).
 */
export abstract class PassagemBaseService {
    constructor(
        public readonly quantidade: Signal<number>,
        private readonly gastarNoBackend: () => Promise<boolean>,
    ) { }

    public possuiSaldo(): boolean {
        return this.quantidade() > 0;
    }

    /** Gasta 1 passagem no backend. Resolve `false` sem alterar nada se não houver saldo. */
    public async gastar(): Promise<boolean> {
        if (!this.possuiSaldo()) return false;
        return this.gastarNoBackend();
    }
}
