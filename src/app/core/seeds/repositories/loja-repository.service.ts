import { Injectable } from "@angular/core";
import { LojasSeeds } from "../data/lojas/lojas.seed";

@Injectable({
    providedIn: 'root'
})
export class LojaRepositoryService {
    public findById(id: string) {
        return LojasSeeds.find(where => where.id == id);
    }
}
