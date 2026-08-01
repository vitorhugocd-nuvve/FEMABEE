import { computed, inject, Injectable } from "@angular/core";
import { CompleteTexto } from "../../core/models/desafios/complete-texto/complete-texto";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";

/** Serviço de busca do CompleteTexto — resolve o desafio ativo (DesafioAtualService); substituir por HTTP quando houver backend. */
@Injectable()
export class BuscarCompleteTextoService {
    private readonly desafioAtualService = inject(DesafioAtualService);

    public readonly data = computed(() => {
        const desafio = this.desafioAtualService.desafioAtivo();
        return desafio instanceof CompleteTexto ? desafio : undefined;
    });
}
