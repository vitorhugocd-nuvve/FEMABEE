import { Injectable } from "@angular/core";
import { MapsSeeds } from "../data/maps/maps.seed";

@Injectable({
    providedIn: 'root'
})
export class MapaRepositoryService {
    public findById(id: string) {
        return MapsSeeds.find(where => where.id == id);
    }

    /** Todos os mapas do jogo — usado pra atravessar as ações de todos eles (ex.: Enciclopédia ligando Lições a fases). */
    public listarTodos() {
        return MapsSeeds;
    }
}