import { Injectable } from "@angular/core";

/** Mock: níveis concluídos identificados pelo id da AcaoDoMapa. Substituir por chamada real quando o backend existir. */
const NIVEIS_CONCLUIDOS_SEED = new Set<string>(["1", "2"]);

@Injectable({
    providedIn: 'root'
})
export class NiveisConcluidosAbelhaService {
    public estaConcluido(acaoId: string): boolean {
        return NIVEIS_CONCLUIDOS_SEED.has(acaoId);
    }
}
