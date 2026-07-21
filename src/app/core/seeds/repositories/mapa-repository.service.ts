import { Injectable } from "@angular/core";
import { MapsSeeds } from "../data/maps/maps.seed";

@Injectable({
    providedIn: 'root'
})
export class MapaRepositoryService {
    public findById(id: string) {
        console.log(MapsSeeds);
        return MapsSeeds.find(where => where.id == id);
    }
}