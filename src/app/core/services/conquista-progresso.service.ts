import { Injectable, effect, inject, untracked } from "@angular/core";
import { DesafioAtualService } from "./desafio-atual.service";
import { NiveisConcluidosAbelhaService } from "../progresso/niveis-concluidos-abelha.service";
import { SequenciaSemErrarService } from "../progresso/sequencia-sem-errar.service";
import { ConquistaService } from "./conquista.service";
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
    private readonly conquistaService = inject(ConquistaService);

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

        // Avalia o estado inicial (ex.: fases já concluídas no mock de partida) assim que sobe.
        this.conquistaService.verificar();
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
        });
    }
}
