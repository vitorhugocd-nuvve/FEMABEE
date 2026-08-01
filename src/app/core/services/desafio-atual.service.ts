import { computed, inject, Injectable, signal } from "@angular/core";
import { DesafioRepositoryService } from "../seeds/repositories/desafio-repository.service";
import { Desafio } from "../models/desafios/desafio";

/** Serviço global: qual desafio está aberto em tela cheia agora (ou nenhum). */
@Injectable({
    providedIn: 'root'
})
export class DesafioAtualService {
    private readonly desafioRepositoryService = inject(DesafioRepositoryService);

    private readonly _desafioAtivo = signal<Desafio | undefined>(undefined);

    readonly desafioAtivo = this._desafioAtivo.asReadonly();
    readonly tipoAtivo = computed(() => this._desafioAtivo()?.tipo);

    public abrir(desafioId: string) {
        const desafio = this.desafioRepositoryService.findById(desafioId);
        if (desafio) this._desafioAtivo.set(desafio);
    }

    public fechar() {
        this._desafioAtivo.set(undefined);
    }
}
