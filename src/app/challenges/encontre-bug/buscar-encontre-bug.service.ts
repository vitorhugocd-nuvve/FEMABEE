import { computed, inject, Injectable } from "@angular/core";
import { EncontreBug } from "../../core/models/desafios/encontre-bug/encontre-bug";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";

/** Serviço de busca do EncontreBug — resolve o desafio ativo (DesafioAtualService); substituir por HTTP quando houver backend. */
@Injectable()
export class BuscarEncontreBugService {
    private readonly desafioAtualService = inject(DesafioAtualService);

    public readonly data = computed(() => {
        const desafio = this.desafioAtualService.desafioAtivo();
        return desafio instanceof EncontreBug ? desafio : undefined;
    });
}
