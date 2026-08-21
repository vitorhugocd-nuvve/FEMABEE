import { Injectable, signal } from "@angular/core";

/**
 * Qual abelha (run) está ativa agora — só em memória, de propósito: um reload
 * volta pra tela de seleção em vez de reabrir uma run "esquecida", evitando
 * estado obsoleto (ex.: abelha removida em outra aba).
 */
@Injectable({ providedIn: 'root' })
export class AbelhaAtivaService {
    private readonly _abelhaAtivaId = signal<string | null>(null);

    readonly abelhaAtivaId = this._abelhaAtivaId.asReadonly();

    selecionar(id: string): void {
        this._abelhaAtivaId.set(id);
    }

    limpar(): void {
        this._abelhaAtivaId.set(null);
    }
}
