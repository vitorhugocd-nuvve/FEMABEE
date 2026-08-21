import { Injectable, signal } from "@angular/core";

export type UserStats = {
    fasesVencidas: number;
    roupasObtidas: number;
    passesAviaoGastos: number;
    passesOnibusGastos: number;
    dinheiroGasto: number;
    mundosConcluidos: number;
    continentesConcluidos: number;
    conquistasObtidas: number;
};

/** Mock: estatísticas do jogador exibidas na tela de Perfil. Substituir por chamada real quando o backend existir. */
const USER_STATS_MOCK: UserStats = {
    fasesVencidas: 12,
    roupasObtidas: 7,
    passesAviaoGastos: 4,
    passesOnibusGastos: 9,
    dinheiroGasto: 320,
    mundosConcluidos: 1,
    continentesConcluidos: 2,
    conquistasObtidas: 5,
};

@Injectable({
    providedIn: 'root'
})
export class UserStatsService {
    private readonly _stats = signal<UserStats>(USER_STATS_MOCK);

    public readonly stats = this._stats.asReadonly();
}
