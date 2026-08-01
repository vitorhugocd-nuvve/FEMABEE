import { computed, inject, Injectable } from "@angular/core";
import { CompleteCodigo } from "../../core/models/desafios/complete-codigo/complete-codigo";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";

/** Serviço de busca do CompleteCodigo — resolve o desafio ativo (DesafioAtualService); substituir por HTTP quando houver backend. */
@Injectable()
export class BuscarCompleteCodigoService {
    private readonly desafioAtualService = inject(DesafioAtualService);

    public readonly data = computed(() => {
        const desafio = this.desafioAtualService.desafioAtivo();
        return desafio instanceof CompleteCodigo ? desafio : undefined;
    });
}
