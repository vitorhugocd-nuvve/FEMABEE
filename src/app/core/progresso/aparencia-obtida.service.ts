import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_BASE_URL } from "../constants/api";
import { RespostaApi } from "../http/resposta-api";
import { AbelhaSelecionadaService } from "../jogador/abelha-selecionada.service";
import { LocalizacaoAtualService } from "../services/localizacao-atual.service";
import { Aparencia } from "../models/aparencia/aparencia";

type RegistroAparencia = { identificador: string };

/**
 * Quais aparências (itens da loja) a abelha selecionada já possui — real, persistido no backend
 * (compra na loja ou recompensa de fase), no mesmo princípio otimista do `AbelhaProgressoService`:
 * atualiza o Set local na hora e dispara a persistência em paralelo, sem aguardar.
 */
@Injectable({
    providedIn: 'root'
})
export class AparenciaObtidaService {
    private readonly http = inject(HttpClient);
    private readonly abelhaSelecionadaService = inject(AbelhaSelecionadaService);
    private readonly localizacaoAtualService = inject(LocalizacaoAtualService);

    private readonly _obtidas = signal<Set<number>>(new Set());
    /** Só fica `true` depois da primeira carga (sucesso ou falha) das aparências da abelha atual — ver `AbelhaProgressoService.conquistasCarregadas` pro mesmo princípio. */
    private readonly _carregado = signal(false);

    public readonly quantidadeObtida = computed(() => this._obtidas().size);
    public readonly carregado = this._carregado.asReadonly();

    constructor() {
        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            console.log(`[APARENCIA-OBTIDA] efeito: abelha=${abelha?.id ?? 'null'} — zerando e (re)carregando`);
            this._obtidas.set(new Set());
            this._carregado.set(false);
            if (abelha) this.carregar(abelha.id);
        });
    }

    public possui(aparenciaId: number): boolean {
        return this._obtidas().has(aparenciaId);
    }

    public marcarObtida(aparenciaId: number): void {
        if (this._obtidas().has(aparenciaId)) return;
        this._obtidas.update(atual => new Set(atual).add(aparenciaId));

        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        if (!idAbelha) return;
        firstValueFrom(this.http.post(`${API_BASE_URL}/abelha/${idAbelha}/aparencias-desbloqueadas`, {
            idAparencia: String(aparenciaId),
            idMapa: this.localizacaoAtualService.mapaAtualId(),
        })).catch(() => {});
    }

    public possuiTodas(itens: Aparencia[]): boolean {
        return itens.length > 0 && itens.every(item => this.possui(item.id));
    }

    private async carregar(idAbelha: string): Promise<void> {
        try {
            const resposta = await firstValueFrom(
                this.http.get<RespostaApi<RegistroAparencia[]>>(`${API_BASE_URL}/abelha/${idAbelha}/aparencias-desbloqueadas`),
            );
            const ids = resposta.dados.map(registro => Number(registro.identificador));
            console.log(`[APARENCIA-OBTIDA] GET OK pra abelha=${idAbelha}:`, ids);
            this._obtidas.set(new Set(ids));
        } catch (erro) {
            console.error(`[APARENCIA-OBTIDA] GET FALHOU pra abelha=${idAbelha}`, erro);
        } finally {
            this._carregado.set(true);
        }
    }
}
