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
    sequenciaSemErrar: number | string;
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
    private readonly _sequenciaSemErrar = signal(0);
    /** Só fica `true` depois da primeira carga (sucesso ou falha) dos valores da abelha atual — ver `AbelhaProgressoService.conquistasCarregadas` pro mesmo princípio. */
    private readonly _carregado = signal(false);

    readonly dinheiro = this._dinheiro.asReadonly();
    readonly ticketContinental = this._ticketContinental.asReadonly();
    readonly ticketRegional = this._ticketRegional.asReadonly();
    readonly sequenciaSemErrar = this._sequenciaSemErrar.asReadonly();
    readonly carregado = this._carregado.asReadonly();

    constructor() {
        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            console.log(`[ABELHA-ECONOMIA] efeito: abelha=${abelha?.id ?? 'null'} — zerando e (re)carregando`);

            // Zera na hora, antes do fetch resolver: sem isso, ao trocar de abelha os valores
            // da abelha anterior (dinheiro, passagens, sequência sem errar) continuam valendo
            // por um instante — e como `ConquistaService.verificar()` pode rodar nesse meio
            // tempo, uma conquista de sequência poderia ser (erroneamente) concedida à nova
            // abelha usando o streak deixado pela anterior.
            this._dinheiro.set(0);
            this._ticketContinental.set(0);
            this._ticketRegional.set(0);
            this._sequenciaSemErrar.set(0);
            this._carregado.set(false);

            if (abelha) this.carregar(abelha.id);
        });
    }

    private async carregar(idAbelha: string): Promise<void> {
        try {
            const resposta = await firstValueFrom(
                this.http.get<RespostaApi<ValoresEconomia>>(`${API_BASE_URL}/abelha/${idAbelha}/info`),
            );
            console.log(`[ABELHA-ECONOMIA] GET OK pra abelha=${idAbelha}:`, resposta.dados);
            this.atualizarValores(resposta.dados);
        } catch (erro) {
            console.error(`[ABELHA-ECONOMIA] GET FALHOU pra abelha=${idAbelha}`, erro);
        } finally {
            this._carregado.set(true);
        }
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

    /** Recompensa de fase/conquista — credita dinheiro na conta da abelha. */
    async ganharDinheiro(valor: number): Promise<boolean> {
        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        if (!idAbelha || valor <= 0) return false;

        try {
            const resposta = await firstValueFrom(
                this.http.patch<RespostaApi<ValoresEconomia>>(`${API_BASE_URL}/abelha/${idAbelha}/dinheiro`, { valor }),
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

    async ganharPassagemContinental(): Promise<boolean> {
        return this.ganharPassagem('continental');
    }

    async ganharPassagemRegional(): Promise<boolean> {
        return this.ganharPassagem('regional');
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

    private async ganharPassagem(tipo: TipoPassaporte): Promise<boolean> {
        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        if (!idAbelha) return false;

        try {
            const resposta = await firstValueFrom(
                this.http.patch<RespostaApi<ValoresEconomia>>(`${API_BASE_URL}/abelha/${idAbelha}/passaporte-${tipo}`, {}),
            );
            this.atualizarValores(resposta.dados);
            return true;
        } catch {
            return false;
        }
    }

    /** Chamado ao concluir uma fase sem nenhum erro no caminho. */
    async incrementarSequenciaSemErrar(): Promise<void> {
        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        if (!idAbelha) return;

        this._sequenciaSemErrar.update(atual => atual + 1);
        try {
            const resposta = await firstValueFrom(
                this.http.patch<RespostaApi<ValoresEconomia>>(`${API_BASE_URL}/abelha/${idAbelha}/sequencia-sem-errar`, {}),
            );
            this.atualizarValores(resposta.dados);
        } catch { /* mantém o valor otimista mesmo se a persistência falhar */ }
    }

    /** Chamado ao errar qualquer coisa durante uma fase — zera a sequência. */
    async resetarSequenciaSemErrar(): Promise<void> {
        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        if (!idAbelha) return;

        this._sequenciaSemErrar.set(0);
        try {
            const resposta = await firstValueFrom(
                this.http.delete<RespostaApi<ValoresEconomia>>(`${API_BASE_URL}/abelha/${idAbelha}/sequencia-sem-errar`),
            );
            this.atualizarValores(resposta.dados);
        } catch { /* mantém o valor otimista mesmo se a persistência falhar */ }
    }

    private atualizarValores(valores: ValoresEconomia): void {
        this._dinheiro.set(Number(valores.dinheiro));
        this._ticketContinental.set(Number(valores.ticketContinental));
        this._ticketRegional.set(Number(valores.ticketRegional));
        this._sequenciaSemErrar.set(Number(valores.sequenciaSemErrar));
    }
}
