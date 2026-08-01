import { Injectable } from "@angular/core";
import { PassagemBaseService } from "./passagem-base.service";

@Injectable({
    providedIn: 'root'
})
export class PassagemOnibusService extends PassagemBaseService {
    constructor() {
        super(4);
    }
}
