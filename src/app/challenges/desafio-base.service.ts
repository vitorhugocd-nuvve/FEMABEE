import { computed, inject, signal } from "@angular/core";
import { TentativasFaseService } from "../core/progresso/tentativas-fase.service";

/**
 * Serviço base abstrato que encapsula o estado genérico compartilhado
 * por qualquer tipo de desafio: carregando, progresso, feedback de resultado.
 *
 * Estenda esta classe nos serviços específicos de cada desafio.
 */
export abstract class DesafioBaseService {
    private readonly tentativasFaseService = inject(TentativasFaseService);

    protected readonly _solicitando  = signal<boolean>(false);
    protected readonly _progresso    = signal<number>(0);

    public readonly solicitando  = this._solicitando.asReadonly();
    public readonly progresso    = this._progresso.asReadonly();

    /**
     * Simula uma chamada de validação ao backend com delay configurável.
     * Substitua por HttpClient quando a API estiver disponível.
     *
     * Registra a tentativa em `TentativasFaseService` sempre que `resultado` for
     * 'correto'/'incorreto' — cobre todos os tipos de desafio que validam certo/errado
     * de graça, sem cada um precisar chamar isso manualmente (Lição, que só chama
     * `simularValidacao(undefined)`, fica de fora corretamente).
     */
    protected async simularValidacao<T>(resultado: T, delayMs = 800): Promise<T> {
        if (this._solicitando()) return resultado;
        this._solicitando.set(true);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        this._solicitando.set(false);

        if (resultado === 'correto' || resultado === 'incorreto') {
            this.tentativasFaseService.registrarTentativa(resultado === 'correto');
        }

        return resultado;
    }
}
