import { signal } from "@angular/core";

/**
 * Serviço base abstrato para uma "carteira" de passagens (ônibus/avião): saldo mockado + gastar/adicionar.
 * Substituir por chamada real quando o backend existir.
 */
export abstract class PassagemBaseService {
    private readonly _quantidade;

    public readonly quantidade;

    constructor(quantidadeInicial: number) {
        this._quantidade = signal(quantidadeInicial);
        this.quantidade = this._quantidade.asReadonly();
    }

    public possuiSaldo(): boolean {
        return this._quantidade() > 0;
    }

    /** Gasta 1 passagem do saldo. Retorna `false` sem alterar o saldo se não houver passagens suficientes. */
    public gastar(): boolean {
        if (!this.possuiSaldo()) return false;
        this._quantidade.update(quantidade => quantidade - 1);
        return true;
    }

    public adicionar(quantidade = 1) {
        this._quantidade.update(atual => atual + quantidade);
    }
}
