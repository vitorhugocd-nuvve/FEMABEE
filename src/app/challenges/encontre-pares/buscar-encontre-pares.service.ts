import { computed, inject, Injectable } from "@angular/core";
import { EncontrePares } from "../../core/models/desafios/encontre-pares/encontre-pares";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";

/** Serviço de busca do EncontrePares — resolve o desafio ativo (DesafioAtualService); substituir por HTTP quando houver backend. */
@Injectable()
export class BuscarEncontreParesService {
    private readonly desafioAtualService = inject(DesafioAtualService);

    public readonly data = computed(() => {
        const desafio = this.desafioAtualService.desafioAtivo();
        return desafio instanceof EncontrePares ? desafio : undefined;
    });
}
