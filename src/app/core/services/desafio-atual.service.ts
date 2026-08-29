import { computed, inject, Injectable, signal } from "@angular/core";
import { DesafioRepositoryService } from "../seeds/repositories/desafio-repository.service";
import { Desafio } from "../models/desafios/desafio";
import { SequenciaSemErrarService } from "../progresso/sequencia-sem-errar.service";
import { TentativasFaseService } from "../progresso/tentativas-fase.service";
import { AbelhaProgressoService } from "../progresso/abelha-progresso.service";
import { LocalizacaoAtualService } from "./localizacao-atual.service";

/** Serviço global: qual desafio está aberto em tela cheia agora (ou nenhum), e a partir de qual ação do mapa. */
@Injectable({
    providedIn: 'root'
})
export class DesafioAtualService {
    private readonly desafioRepositoryService = inject(DesafioRepositoryService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly tentativasFaseService = inject(TentativasFaseService);
    private readonly abelhaProgressoService = inject(AbelhaProgressoService);
    private readonly localizacaoAtualService = inject(LocalizacaoAtualService);

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
        this.tentativasFaseService.iniciarFase();
    }

    /**
     * Fecha o desafio aberto — chamado tanto ao sair depois de completar quanto ao voltar
     * ao mapa sem terminar (ex.: errou tudo num quiz e desistiu). Se ainda não foi enviado
     * um resumo de tentativas nesta sessão (`ConquistaProgressoService` já manda ao concluir
     * com sucesso), manda aqui — assim uma tentativa fracassada também fica registrada,
     * não só as bem-sucedidas.
     */
    public fechar() {
        const acaoId = this._acaoIdAtiva();
        const tentativas = this.tentativasFaseService.tentativas();

        if (acaoId && tentativas > 0 && this.tentativasFaseService.reivindicarEnvio()) {
            this.abelhaProgressoService.registrarTentativaFase(
                acaoId, this.localizacaoAtualService.mapaAtualId(), tentativas, this.tentativasFaseService.erros(),
            );
        }

        this._desafioAtivo.set(undefined);
        this._acaoIdAtiva.set(undefined);
    }
}
