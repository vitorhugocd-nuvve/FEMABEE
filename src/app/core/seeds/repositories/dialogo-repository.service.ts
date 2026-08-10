import { Injectable } from "@angular/core";
import { DialogosSeeds } from "../data/dialogos/dialogos.seed";

@Injectable({
    providedIn: 'root'
})
export class DialogoRepositoryService {
    public findById(id: string) {
        return DialogosSeeds.find(where => where.id == id);
    }
}
