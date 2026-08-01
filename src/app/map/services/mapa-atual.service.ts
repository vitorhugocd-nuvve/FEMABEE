import { effect, inject, Injectable, signal } from "@angular/core";
import { MapaRepositoryService } from "../../core/seeds/repositories/mapa-repository.service";
import { Mapa } from "../../core/models/map/mapa";
import { LocalizacaoAtualService } from "../../core/services/localizacao-atual.service";

@Injectable()
export class MapaAtualService {
    private readonly mapaRepository = inject(MapaRepositoryService);
    private readonly localizacaoAtualService = inject(LocalizacaoAtualService);

    readonly mapa = signal<Mapa | undefined>(undefined);
    readonly requesting = signal<boolean>(false);

    constructor() {
        effect(() => {
            const id = this.localizacaoAtualService.mapaAtualId();
            this.carregar(id);
        });
    }

    private async carregar(id: string) {
        this.requesting.set(true);
        await new Promise((r) => setTimeout(r, 2000));
        const mapa = this.mapaRepository.findById(id);
        this.requesting.set(false);
        this.mapa.set(mapa);
    }
}
