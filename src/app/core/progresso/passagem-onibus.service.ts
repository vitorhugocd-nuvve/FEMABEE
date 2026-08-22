import { inject, Injectable } from "@angular/core";
import { AbelhaEconomiaService } from "../jogador/abelha-economia.service";
import { PassagemBaseService } from "./passagem-base.service";

@Injectable({
    providedIn: 'root'
})
export class PassagemOnibusService extends PassagemBaseService {
    constructor() {
        const abelhaEconomiaService = inject(AbelhaEconomiaService);
        super(abelhaEconomiaService.ticketRegional, () => abelhaEconomiaService.gastarPassagemRegional());
    }
}
