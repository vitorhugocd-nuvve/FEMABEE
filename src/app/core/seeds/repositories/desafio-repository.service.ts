import { Injectable } from "@angular/core";
import { DesafiosSeeds } from "../data/desafios/desafios.seed";

@Injectable({
    providedIn: 'root'
})
export class DesafioRepositoryService {
    public findById(id: string) {
        return DesafiosSeeds.find(where => where.id == id);
    }
}
