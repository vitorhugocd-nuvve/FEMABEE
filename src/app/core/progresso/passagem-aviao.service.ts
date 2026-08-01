import { Injectable } from "@angular/core";
import { PassagemBaseService } from "./passagem-base.service";

@Injectable({
    providedIn: 'root'
})
export class PassagemAviaoService extends PassagemBaseService {
    constructor() {
        super(2);
    }
}
