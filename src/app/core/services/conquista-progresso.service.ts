import { Injectable, effect, inject, untracked } from "@angular/core";
import { DesafioAtualService } from "./desafio-atual.service";
import { NiveisConcluidosAbelhaService } from "../progresso/niveis-concluidos-abelha.service";
import { SequenciaSemErrarService } from "../progresso/sequencia-sem-errar.service";
import { TentativasFaseService } from "../progresso/tentativas-fase.service";
import { AbelhaProgressoService } from "../progresso/abelha-progresso.service";
import { ConquistaService } from "./conquista.service";
import { RecompensaService } from "./recompensa.service";
import { MapaRepositoryService } from "../seeds/repositories/mapa-repository.service";
import { LocalizacaoAtualService } from "./localizacao-atual.service";
import { QuizService } from "../../challenges/quiz/quiz.service";
import { EncontreBugService } from "../../challenges/encontre-bug/encontre-bug.service";
import { CompleteTextoService } from "../../challenges/complete-texto/complete-texto.service";
import { CompleteCodigoService } from "../../challenges/complete-codigo/complete-codigo.service";
import { EncontreParesService } from "../../challenges/encontre-pares/encontre-pares.service";
import { LicaoService } from "../../challenges/licao/licao.service";

/**
 * Observa a conclusão de qualquer tipo de desafio e, quando acontece: marca a fase como
 * concluída, atualiza a sequência sem errar e reavalia as conquistas — o "sempre roda"
 * pedido pra seed de conquistas, sem precisar espalhar essa lógica em cada desafio.
 *
 * Precisa ser instanciado eagerly (injetado em `App`) pra esses efeitos rodarem desde o início.
 */
@Injectable({
    providedIn: 'root'
})
export class ConquistaProgressoService {
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly tentativasFaseService = inject(TentativasFaseService);
    private readonly abelhaProgressoService = inject(AbelhaProgressoService);
    private readonly conquistaService = inject(ConquistaService);
    private readonly recompensaService = inject(RecompensaService);
    private readonly mapaRepositoryService = inject(MapaRepositoryService);
    private readonly localizacaoAtualService = inject(LocalizacaoAtualService);

    private readonly quizService = inject(QuizService);
    private readonly encontreBugService = inject(EncontreBugService);
    private readonly completeTextoService = inject(CompleteTextoService);
    private readonly completeCodigoService = inject(CompleteCodigoService);
    private readonly encontreParesService = inject(EncontreParesService);
    private readonly licaoService = inject(LicaoService);

    constructor() {
        effect(() => { if (this.quizService.concluido()) this.registrarFaseConcluida(); });
        effect(() => { if (this.encontreBugService.concluido()) this.registrarFaseConcluida(); });
        effect(() => { if (this.completeTextoService.concluido()) this.registrarFaseConcluida(); });
        effect(() => { if (this.completeCodigoService.concluido()) this.registrarFaseConcluida(); });
        effect(() => { if (this.encontreParesService.concluido()) this.registrarFaseConcluida(); });
        effect(() => { if (this.licaoService.concluida()) this.registrarFaseConcluida(); });

        // Reavalia assim que as conquistas já desbloqueadas terminam de carregar do backend —
        // até lá, `verificar()` não faz nada (ver o comentário em ConquistaService.verificar).
        effect(() => { this.abelhaProgressoService.conquistasCarregadas(); this.conquistaService.verificar(); });
    }

    /**
     * Roda inteiramente `untracked` porque é chamada de dentro do corpo de vários `effect()`s
     * (um por tipo de desafio) — sem isso, qualquer signal lido aqui (ex.: `acaoIdAtiva`) vira
     * dependência implícita DAQUELE efeito específico, e passa a redisparar sempre que essa
     * signal mudar (ex.: ao abrir outro desafio), mesmo sem o `concluido()` do efeito ter mudado.
     */
    private registrarFaseConcluida(): void {
        untracked(() => {
            const acaoId = this.desafioAtualService.acaoIdAtiva();
            if (!acaoId || this.niveisConcluidosAbelhaService.estaConcluido(acaoId)) return;

            this.niveisConcluidosAbelhaService.marcarConcluido(acaoId);
            this.sequenciaSemErrarService.registrarFaseConcluida();
            this.conquistaService.verificar();

            const idMapa = this.localizacaoAtualService.mapaAtualId();
            const acao = this.mapaRepositoryService.findById(idMapa)?.acoes.find(a => a.id === acaoId);
            if (acao?.recompensas.length) this.recompensaService.conceder(acao.recompensas);

            if (this.tentativasFaseService.reivindicarEnvio()) {
                this.abelhaProgressoService.registrarTentativaFase(
                    acaoId, idMapa, this.tentativasFaseService.tentativas(), this.tentativasFaseService.erros(),
                );
            }
        });
    }
}
