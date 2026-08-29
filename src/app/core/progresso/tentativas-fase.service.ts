import { Injectable, signal } from "@angular/core";

/**
 * Contador em memória de tentativas/erros da fase aberta no momento — zera a cada
 * `DesafioAtualService.abrir()` e é lido por `ConquistaProgressoService` ao detectar
 * que a fase foi concluída, pra registrar o resumo ("tentou N vezes, errou M") no backend.
 * Mesmo princípio do `SequenciaSemErrarService`.
 */
@Injectable({
    providedIn: 'root'
})
export class TentativasFaseService {
    private readonly _tentativas = signal(0);
    private readonly _erros = signal(0);
    /** Garante que o resumo da sessão só seja mandado pro backend uma vez, não importa por qual caminho (sucesso ou fechar sem terminar). */
    private readonly _jaEnviada = signal(false);

    public readonly tentativas = this._tentativas.asReadonly();
    public readonly erros = this._erros.asReadonly();

    /** Chamado sempre que uma nova fase é aberta (DesafioAtualService.abrir). */
    public iniciarFase(): void {
        this._tentativas.set(0);
        this._erros.set(0);
        this._jaEnviada.set(false);
    }

    /** Chamado a cada submissão validada (certa ou errada) em qualquer desafio. */
    public registrarTentativa(correto: boolean): void {
        this._tentativas.update(atual => atual + 1);
        if (!correto) this._erros.update(atual => atual + 1);
    }

    /**
     * "Reivindica" o direito de mandar o resumo desta sessão pro backend — quem chamar primeiro
     * (sucesso via `ConquistaProgressoService`, ou fechamento sem terminar via `DesafioAtualService`)
     * ganha `true` e deve mandar; qualquer chamada seguinte (na mesma sessão) recebe `false`.
     */
    public reivindicarEnvio(): boolean {
        if (this._jaEnviada()) return false;
        this._jaEnviada.set(true);
        return true;
    }
}
