import { inject, Injectable } from "@angular/core";
import { AbelhaProgressoService } from "./abelha-progresso.service";

@Injectable({
    providedIn: 'root'
})
export class NiveisConcluidosAbelhaService {
    private readonly abelhaProgressoService = inject(AbelhaProgressoService);

    /** Id da última fase marcada como concluída — observável por quem precisa reagir a "uma fase acabou de terminar". */
    public readonly ultimoConcluido = this.abelhaProgressoService.ultimaFaseConcluida;

    public estaConcluido(acaoId: string): boolean {
        return this.abelhaProgressoService.estaFaseConcluida(acaoId);
    }

    public marcarConcluido(acaoId: string): void {
        this.abelhaProgressoService.marcarFaseConcluida(acaoId);
    }

    public quantidadeConcluida(): number {
        return this.abelhaProgressoService.totalFasesConcluidas();
    }
}
