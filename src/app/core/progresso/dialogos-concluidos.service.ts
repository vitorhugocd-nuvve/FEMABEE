import { inject, Injectable } from "@angular/core";
import { AbelhaProgressoService } from "./abelha-progresso.service";

/** Diálogos já exibidos — depois de fechados, não devem aparecer de novo (persistido no backend, por abelha). */
@Injectable({
    providedIn: 'root'
})
export class DialogosConcluidosService {
    private readonly abelhaProgressoService = inject(AbelhaProgressoService);

    /** `true` só depois da primeira carga do backend — ver `AbelhaProgressoService.dialogosCarregados`. */
    public readonly carregado = this.abelhaProgressoService.dialogosCarregados;

    public estaConcluido(dialogoId: string): boolean {
        return this.abelhaProgressoService.estaDialogoConcluido(dialogoId);
    }

    public marcarConcluido(dialogoId: string): void {
        this.abelhaProgressoService.marcarDialogoConcluido(dialogoId);
    }
}
