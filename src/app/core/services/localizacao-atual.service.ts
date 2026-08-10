import { Injectable, signal } from "@angular/core";
import { ID_MAPA_INICIAL } from "../seeds/data/maps/mapa-mundi";

/** Serviço global: em qual mapa a abelha está localizada agora, e a navegação entre mapas. */
@Injectable({
    providedIn: 'root'
})
export class LocalizacaoAtualService {
    private readonly _mapaAtualId = signal<string>(ID_MAPA_INICIAL);

    readonly mapaAtualId = this._mapaAtualId.asReadonly();

    public irPara(mapaId: string) {
        this._mapaAtualId.set(mapaId);
    }
}
