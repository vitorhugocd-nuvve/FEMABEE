import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_BASE_URL } from "../constants/api";
import { RespostaApi } from "../http/resposta-api";
import { AbelhaSelecionadaService } from "./abelha-selecionada.service";

type ValoresEconomia = {
    dinheiro: number | string;
    ticketContinental: number | string;
    ticketRegional: number | string;
};

type TipoPassaporte = 'continental' | 'regional';

/**
 * Carteira real (dinheiro + as duas passagens) da abelha selecionada — sincroniza com o
 * backend a cada troca de abelha e a cada gasto. Fonte de verdade única pro resto do app
 * (contador do header, loja, viagens) em vez de saldo mockado local.
 */
@Injectable({ providedIn: 'root' })
export class AbelhaEconomiaService {
    private readonly http = inject(HttpClient);
    private readonly abelhaSelecionadaService = inject(AbelhaSelecionadaService);

    private readonly _dinheiro = signal(0);
    private readonly _ticketContinental = signal(0);
    private readonly _ticketRegional = signal(0);

    readonly dinheiro = this._dinheiro.asReadonly();
    readonly ticketContinental = this._ticketContinental.asReadonly();
    readonly ticketRegional = this._ticketRegional.asReadonly();

    constructor() {
        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            if (abelha) this.carregar(abelha.id);
        });
    }

    private async carregar(idAbelha: string): Promise<void> {
        const resposta = await firstValueFrom(
            this.http.get<RespostaApi<ValoresEconomia>>(`${API_BASE_URL}/abelha/${idAbelha}/info`),
        );
        this.atualizarValores(resposta.dados);
    }

    /** `valor` positivo credita, negativo debita. Resolve `false` (sem lançar) em saldo insuficiente. */
    async gastarDinheiro(valor: number): Promise<boolean> {
        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        if (!idAbelha || this._dinheiro() < valor) return false;

        try {
            const resposta = await firstValueFrom(
                this.http.patch<RespostaApi<ValoresEconomia>>(`${API_BASE_URL}/abelha/${idAbelha}/dinheiro`, { valor: -valor }),
            );
            this.atualizarValores(resposta.dados);
            return true;
        } catch {
            return false;
        }
    }

    async gastarPassagemContinental(): Promise<boolean> {
        return this.gastarPassagem('continental');
    }

    async gastarPassagemRegional(): Promise<boolean> {
        return this.gastarPassagem('regional');
    }

    private async gastarPassagem(tipo: TipoPassaporte): Promise<boolean> {
        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        const saldoAtual = tipo === 'continental' ? this._ticketContinental() : this._ticketRegional();
        if (!idAbelha || saldoAtual <= 0) return false;

        try {
            const resposta = await firstValueFrom(
                this.http.delete<RespostaApi<ValoresEconomia>>(`${API_BASE_URL}/abelha/${idAbelha}/passaporte-${tipo}`),
            );
            this.atualizarValores(resposta.dados);
            return true;
        } catch {
            return false;
        }
    }

    private atualizarValores(valores: ValoresEconomia): void {
        this._dinheiro.set(Number(valores.dinheiro));
        this._ticketContinental.set(Number(valores.ticketContinental));
        this._ticketRegional.set(Number(valores.ticketRegional));
    }
}
