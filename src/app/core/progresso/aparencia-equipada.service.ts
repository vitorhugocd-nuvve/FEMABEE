import { computed, inject, Injectable, signal } from "@angular/core";
import { Aparencia } from "../models/aparencia/aparencia";
import { TipoAparencia } from "../models/aparencia/tipo-aparencia";
import { TamanhoAbelha } from "../models/aparencia/tamanhos";
import { LojaRepositoryService } from "../seeds/repositories/loja-repository.service";

/** Ids equipados por padrão — mesmo visual do mock atual (suéter preto + rosto 1), pra não trocar a cara da abelha do usuário do nada. */
const IDS_EQUIPADOS_PADRAO = [1, 9];

/** Quais aparências (e qual tamanho de corpo) o jogador tem equipados agora. Fonte de verdade da abelha exibida no menu do usuário. */
@Injectable({
    providedIn: 'root'
})
export class AparenciaEquipadaService {
    private readonly lojaRepositoryService = inject(LojaRepositoryService);

    private readonly _equipadas = signal<Partial<Record<TipoAparencia, Aparencia>>>(
        Object.fromEntries(
            IDS_EQUIPADOS_PADRAO
                .map(id => this.lojaRepositoryService.findAparenciaById(id))
                .filter((aparencia): aparencia is Aparencia => !!aparencia)
                .map(aparencia => [aparencia.tipo, aparencia])
        )
    );

    private readonly _tamanho = signal<TamanhoAbelha>(TamanhoAbelha.AltaGorda);

    /** Lista pronta pra passar direto em `<bee-abelha [aparencias]="...">`. */
    public readonly equipadas = computed(() => Object.values(this._equipadas()));

    public readonly tamanho = this._tamanho.asReadonly();

    public selecionarTamanho(tamanho: TamanhoAbelha): void {
        this._tamanho.set(tamanho);
    }

    public equipadaPorTipo(tipo: TipoAparencia): Aparencia | undefined {
        return this._equipadas()[tipo];
    }

    /** Equipa a aparência no slot do seu tipo, substituindo o que já estava lá. */
    public equipar(aparencia: Aparencia): void {
        this._equipadas.update(atual => ({ ...atual, [aparencia.tipo]: aparencia }));
    }

    public desequipar(tipo: TipoAparencia): void {
        this._equipadas.update(atual => {
            const { [tipo]: _removida, ...resto } = atual;
            return resto;
        });
    }
}
