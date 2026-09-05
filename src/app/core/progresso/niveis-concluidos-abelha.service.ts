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

    /**
     * Concluída em QUALQUER mapa, não só o atualmente aberto — use isto (não `estaConcluido`)
     * pra checar uma fase de um mapa que pode não ser o mapa atual (ex.: condição de conquista
     * avaliada enquanto a abelha está em outro mapa).
     */
    public estaConcluidoGlobal(acaoId: string): boolean {
        return this.abelhaProgressoService.estaFaseConcluidaGlobal(acaoId);
    }

    public marcarConcluido(acaoId: string): void {
        this.abelhaProgressoService.marcarFaseConcluida(acaoId);
    }

    public quantidadeConcluida(): number {
        return this.abelhaProgressoService.totalFasesConcluidas();
    }
}
