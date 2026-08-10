import { computed, inject, Injectable, signal } from "@angular/core";
import { DesafioRepositoryService } from "../seeds/repositories/desafio-repository.service";
import { Desafio } from "../models/desafios/desafio";
import { SequenciaSemErrarService } from "../progresso/sequencia-sem-errar.service";

/** Serviço global: qual desafio está aberto em tela cheia agora (ou nenhum), e a partir de qual ação do mapa. */
@Injectable({
    providedIn: 'root'
})
export class DesafioAtualService {
    private readonly desafioRepositoryService = inject(DesafioRepositoryService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);

    private readonly _desafioAtivo = signal<Desafio | undefined>(undefined);
    private readonly _acaoIdAtiva = signal<string | undefined>(undefined);

    readonly desafioAtivo = this._desafioAtivo.asReadonly();
    readonly acaoIdAtiva = this._acaoIdAtiva.asReadonly();
    readonly tipoAtivo = computed(() => this._desafioAtivo()?.tipo);

    public abrir(acaoId: string, desafioId: string) {
        const desafio = this.desafioRepositoryService.findById(desafioId);
        if (!desafio) return;

        this._desafioAtivo.set(desafio);
        this._acaoIdAtiva.set(acaoId);
        this.sequenciaSemErrarService.iniciarFase();
    }

    public fechar() {
        this._desafioAtivo.set(undefined);
        this._acaoIdAtiva.set(undefined);
    }
}
