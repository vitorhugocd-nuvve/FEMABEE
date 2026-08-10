import { Injectable } from "@angular/core";
import { NpcsSeeds } from "../data/npcs/npcs.seed";

@Injectable({
    providedIn: 'root'
})
export class NpcRepositoryService {
    public findById(id: string) {
        return NpcsSeeds.find(where => where.id == id);
    }
}
