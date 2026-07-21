import { inject, Injectable, signal } from "@angular/core";
import { MapaRepositoryService } from "../../core/seeds/repositories/mapa-repository.service";
import { Mapa } from "../../core/models/map/mapa";

@Injectable()
export class MapaAtualService {
    private readonly mapaRepository = inject(MapaRepositoryService);
    
    readonly mapa = signal<Mapa | undefined>(undefined);
    readonly requesting = signal<boolean>(false);
    
    async request() {
        this.requesting.set(true);
        await new Promise((r) => setTimeout(r, 5000));
        const mapa = this.mapaRepository.findById('1');
        this.requesting.set(false);
        this.mapa.set(mapa);
        console.log(mapa);
    }
}