import { Injectable, signal } from "@angular/core";

/**
 * Sequência global de fases concluídas seguidas sem nenhuma resposta errada.
 * Zera assim que uma resposta errada acontece em qualquer desafio.
 */
@Injectable({
    providedIn: 'root'
})
export class SequenciaSemErrarService {
    private readonly _sequenciaAtual = signal(0);
    private readonly _erroNaFaseAtual = signal(false);

    public readonly sequenciaAtual = this._sequenciaAtual.asReadonly();

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
        this._sequenciaAtual.update(atual => this._erroNaFaseAtual() ? 0 : atual + 1);
    }
}
