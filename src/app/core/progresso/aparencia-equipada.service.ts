import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_BASE_URL } from "../constants/api";
import { RespostaApi } from "../http/resposta-api";
import { AbelhaSelecionadaService } from "../jogador/abelha-selecionada.service";
import { Aparencia } from "../models/aparencia/aparencia";
import { TipoAparencia } from "../models/aparencia/tipo-aparencia";
import { TamanhoAbelha } from "../models/aparencia/tamanhos";
import { LojaRepositoryService } from "../seeds/repositories/loja-repository.service";

type InfoEquipamento = { tamanho?: string; aparenciasEquipadas?: string[] };

/**
 * Quais aparências (e qual tamanho de corpo) a abelha SELECIONADA tem equipados agora — real,
 * persistido por abelha no backend (por isso troca de abelha reflete no visual do menu), no
 * mesmo princípio otimista do resto do progresso: atualiza local na hora, persiste em paralelo.
 */
@Injectable({
    providedIn: 'root'
})
export class AparenciaEquipadaService {
    private readonly http = inject(HttpClient);
    private readonly abelhaSelecionadaService = inject(AbelhaSelecionadaService);
    private readonly lojaRepositoryService = inject(LojaRepositoryService);

    private readonly _equipadas = signal<Partial<Record<TipoAparencia, Aparencia>>>({});
    private readonly _tamanho = signal<TamanhoAbelha>(TamanhoAbelha.AltaGorda);

    /** Lista pronta pra passar direto em `<bee-abelha [aparencias]="...">`. */
    public readonly equipadas = computed(() => Object.values(this._equipadas()));

    public readonly tamanho = this._tamanho.asReadonly();

    constructor() {
        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            this._equipadas.set({});
            this._tamanho.set(TamanhoAbelha.AltaGorda);
            if (abelha) this.carregar(abelha.id);
        });
    }

    public selecionarTamanho(tamanho: TamanhoAbelha): void {
        this._tamanho.set(tamanho);
        this.persistir();
    }

    public equipadaPorTipo(tipo: TipoAparencia): Aparencia | undefined {
        return this._equipadas()[tipo];
    }

    /** Equipa a aparência no slot do seu tipo, substituindo o que já estava lá. */
    public equipar(aparencia: Aparencia): void {
        this._equipadas.update(atual => ({ ...atual, [aparencia.tipo]: aparencia }));
        this.persistir();
    }

    public desequipar(tipo: TipoAparencia): void {
        this._equipadas.update(atual => {
            const { [tipo]: _removida, ...resto } = atual;
            return resto;
        });
        this.persistir();
    }

    private async carregar(idAbelha: string): Promise<void> {
        const resposta = await firstValueFrom(
            this.http.get<RespostaApi<InfoEquipamento>>(`${API_BASE_URL}/abelha/${idAbelha}/info`),
        );

        const tamanhoSalvo = Object.values(TamanhoAbelha).find(t => t === resposta.dados.tamanho);
        this._tamanho.set(tamanhoSalvo ?? TamanhoAbelha.AltaGorda);

        const equipadas: Partial<Record<TipoAparencia, Aparencia>> = {};
        for (const id of resposta.dados.aparenciasEquipadas ?? []) {
            const aparencia = this.lojaRepositoryService.findAparenciaById(Number(id));
            if (aparencia) equipadas[aparencia.tipo] = aparencia;
        }
        this._equipadas.set(equipadas);
    }

    private persistir(): void {
        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        if (!idAbelha) return;

        const aparenciasEquipadas = Object.values(this._equipadas()).map(aparencia => String(aparencia.id));
        firstValueFrom(this.http.patch(`${API_BASE_URL}/abelha/${idAbelha}/equipamento`, {
            tamanho: this._tamanho(),
            aparenciasEquipadas,
        })).catch(() => {});
    }
}
