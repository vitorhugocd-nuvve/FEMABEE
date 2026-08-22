import { inject, Injectable } from "@angular/core";
import { AbelhaProgressoService } from "./abelha-progresso.service";

@Injectable({
    providedIn: 'root'
})
export class AviaoObtidoService {
    private readonly abelhaProgressoService = inject(AbelhaProgressoService);

    public estaObtido(acaoId: string): boolean {
        return this.abelhaProgressoService.estaAeroportoDesbloqueado(acaoId);
    }

    public marcarObtido(acaoId: string): void {
        this.abelhaProgressoService.desbloquearAeroporto(acaoId);
    }
}
