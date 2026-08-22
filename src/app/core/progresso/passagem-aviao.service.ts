import { inject, Injectable } from "@angular/core";
import { AbelhaEconomiaService } from "../jogador/abelha-economia.service";
import { PassagemBaseService } from "./passagem-base.service";

@Injectable({
    providedIn: 'root'
})
export class PassagemAviaoService extends PassagemBaseService {
    constructor() {
        const abelhaEconomiaService = inject(AbelhaEconomiaService);
        super(abelhaEconomiaService.ticketContinental, () => abelhaEconomiaService.gastarPassagemContinental());
    }
}
