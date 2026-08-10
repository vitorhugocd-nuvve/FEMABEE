import { Injectable, inject, signal } from "@angular/core";
import { Dialogo } from "../models/dialogo/dialogo";
import { DialogoRepositoryService } from "../seeds/repositories/dialogo-repository.service";
import { DialogosConcluidosService } from "../progresso/dialogos-concluidos.service";

/** Serviço global: qual diálogo está aparecendo agora (ou nenhum). */
@Injectable({
    providedIn: 'root'
})
export class DialogoAtualService {
    private readonly dialogoRepositoryService = inject(DialogoRepositoryService);
    private readonly dialogosConcluidosService = inject(DialogosConcluidosService);

    private readonly _dialogoAtivo = signal<Dialogo | undefined>(undefined);

    readonly dialogoAtivo = this._dialogoAtivo.asReadonly();

    public abrir(dialogoId: string): void {
        // Só um diálogo por vez, e nunca repete um já concluído.
        if (this._dialogoAtivo() || this.dialogosConcluidosService.estaConcluido(dialogoId)) return;

        const dialogo = this.dialogoRepositoryService.findById(dialogoId);
        if (dialogo) this._dialogoAtivo.set(dialogo);
    }

    /** Fechar (de qualquer jeito — terminando as falas ou tocando em "fechar") marca o diálogo como concluído. */
    public fechar(): void {
        const dialogo = this._dialogoAtivo();
        if (dialogo) this.dialogosConcluidosService.marcarConcluido(dialogo.id);
        this._dialogoAtivo.set(undefined);
    }
}
