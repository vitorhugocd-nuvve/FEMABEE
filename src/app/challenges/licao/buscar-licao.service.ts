import { computed, inject, Injectable } from "@angular/core";
import { Licao } from "../../core/models/desafios/licao/licao";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";

/** Serviço de busca da Lição — resolve o desafio ativo (DesafioAtualService); substituir por HTTP quando houver backend. */
@Injectable()
export class BuscarLicaoService {
    private readonly desafioAtualService = inject(DesafioAtualService);

    public readonly data = computed(() => {
        const desafio = this.desafioAtualService.desafioAtivo();
        return desafio instanceof Licao ? desafio : undefined;
    });
}
