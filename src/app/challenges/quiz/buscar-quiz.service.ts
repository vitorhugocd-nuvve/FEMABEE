import { computed, inject, Injectable } from "@angular/core";
import { Quiz } from "../../core/models/desafios/quiz/quiz";
import { DesafioAtualService } from "../../core/services/desafio-atual.service";

/** Serviço de busca do Quiz — resolve o desafio ativo (DesafioAtualService); substituir por HTTP quando houver backend. */
@Injectable()
export class BuscarQuizService {
    private readonly desafioAtualService = inject(DesafioAtualService);

    public readonly data = computed(() => {
        const desafio = this.desafioAtualService.desafioAtivo();
        return desafio instanceof Quiz ? desafio : undefined;
    });
}
