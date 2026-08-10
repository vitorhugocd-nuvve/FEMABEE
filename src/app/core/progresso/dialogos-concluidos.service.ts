import { Injectable, signal } from "@angular/core";

/** Diálogos já exibidos — depois de fechados, não devem aparecer de novo. */
@Injectable({
    providedIn: 'root'
})
export class DialogosConcluidosService {
    private readonly _concluidos = signal<Set<string>>(new Set());

    public estaConcluido(dialogoId: string): boolean {
        return this._concluidos().has(dialogoId);
    }

    public marcarConcluido(dialogoId: string): void {
        if (this._concluidos().has(dialogoId)) return;
        this._concluidos.update(atual => new Set(atual).add(dialogoId));
    }
}
