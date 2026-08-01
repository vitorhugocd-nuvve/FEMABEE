import { Injectable } from "@angular/core";

/** Mock: aeroportos obtidos identificados pelo id da AcaoDoMapa. Substituir por chamada real quando o backend existir. */
const AVIOES_OBTIDOS_SEED = new Set<string>();

@Injectable({
    providedIn: 'root'
})
export class AviaoObtidoService {
    public estaObtido(acaoId: string): boolean {
        return AVIOES_OBTIDOS_SEED.has(acaoId);
    }
}
