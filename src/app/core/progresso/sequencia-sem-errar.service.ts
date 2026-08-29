import { inject, Injectable, signal } from "@angular/core";
import { AbelhaEconomiaService } from "../jogador/abelha-economia.service";

/**
 * Sequência global de fases concluídas seguidas sem nenhuma resposta errada — persistida
 * (AbelhaEconomiaService), sobrevive a reload/login. `_erroNaFaseAtual` continua só em memória
 * de propósito: é transiente, existe só pra decidir o que fazer quando a fase ATUAL terminar.
 */
@Injectable({
    providedIn: 'root'
})
export class SequenciaSemErrarService {
    private readonly abelhaEconomiaService = inject(AbelhaEconomiaService);
    private readonly _erroNaFaseAtual = signal(false);

    public readonly sequenciaAtual = this.abelhaEconomiaService.sequenciaSemErrar;

    /** Chamado sempre que uma nova fase é aberta (DesafioAtualService.abrir). */
    public iniciarFase(): void {
        this._erroNaFaseAtual.set(false);
    }

    /** Chamado sempre que uma resposta errada acontece em qualquer desafio. */
    public registrarErro(): void {
        this._erroNaFaseAtual.set(true);
    }

    /** Chamado quando a fase aberta no momento é concluída por inteiro. */
    public registrarFaseConcluida(): void {
        if (this._erroNaFaseAtual()) {
            this.abelhaEconomiaService.resetarSequenciaSemErrar();
        } else {
            this.abelhaEconomiaService.incrementarSequenciaSemErrar();
        }
    }
}
