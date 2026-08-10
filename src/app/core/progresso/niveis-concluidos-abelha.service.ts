import { Injectable, signal } from "@angular/core";

/** Mock: níveis concluídos identificados pelo id da AcaoDoMapa. Substituir por chamada real quando o backend existir. */
const NIVEIS_CONCLUIDOS_SEED = new Set<string>(["1", "2"]);

@Injectable({
    providedIn: 'root'
})
export class NiveisConcluidosAbelhaService {
    private readonly _concluidos = signal<Set<string>>(new Set(NIVEIS_CONCLUIDOS_SEED));
    /** Id da última fase marcada como concluída — observável por quem precisa reagir a "uma fase acabou de terminar". */
    private readonly _ultimoConcluido = signal<string | undefined>(undefined);

    public readonly ultimoConcluido = this._ultimoConcluido.asReadonly();

    public estaConcluido(acaoId: string): boolean {
        return this._concluidos().has(acaoId);
    }

    public marcarConcluido(acaoId: string): void {
        if (this._concluidos().has(acaoId)) return;
        this._concluidos.update(atual => new Set(atual).add(acaoId));
        this._ultimoConcluido.set(acaoId);
    }

    public quantidadeConcluida(): number {
        return this._concluidos().size;
    }
}
