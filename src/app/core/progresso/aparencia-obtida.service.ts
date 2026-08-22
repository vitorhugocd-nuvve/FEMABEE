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

    public readonly quantidadeObtida = computed(() => this._obtidas().size);

    constructor() {
        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            this._obtidas.set(new Set());
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
        const resposta = await firstValueFrom(
            this.http.get<RespostaApi<RegistroAparencia[]>>(`${API_BASE_URL}/abelha/${idAbelha}/aparencias-desbloqueadas`),
        );
        this._obtidas.set(new Set(resposta.dados.map(registro => Number(registro.identificador))));
    }
}
