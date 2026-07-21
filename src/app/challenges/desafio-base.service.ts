import { computed, signal } from "@angular/core";

/**
 * Serviço base abstrato que encapsula o estado genérico compartilhado
 * por qualquer tipo de desafio: carregando, progresso, feedback de resultado.
 *
 * Estenda esta classe nos serviços específicos de cada desafio.
 */
export abstract class DesafioBaseService {
    protected readonly _solicitando  = signal<boolean>(false);
    protected readonly _progresso    = signal<number>(0);

    public readonly solicitando  = this._solicitando.asReadonly();
    public readonly progresso    = this._progresso.asReadonly();

    /**
     * Simula uma chamada de validação ao backend com delay configurável.
     * Substitua por HttpClient quando a API estiver disponível.
     */
    protected async simularValidacao<T>(resultado: T, delayMs = 800): Promise<T> {
        if (this._solicitando()) return resultado;
        this._solicitando.set(true);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        this._solicitando.set(false);
        return resultado;
    }
}
