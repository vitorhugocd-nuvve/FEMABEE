import { Injectable } from "@angular/core";

/** Mock: pontos de ônibus obtidos identificados pelo id da AcaoDoMapa. Substituir por chamada real quando o backend existir. */
const ONIBUS_OBTIDOS_SEED = new Set<string>(["3"]);

@Injectable({
    providedIn: 'root'
})
export class OnibusObtidoService {
    public estaObtido(acaoId: string): boolean {
        return ONIBUS_OBTIDOS_SEED.has(acaoId);
    }
}
