import { Injectable } from "@angular/core";
import { ZZFX } from "zzfx";

/**
 * Efeitos sonoros 8-bit via ZzFX — síntese pura via Web Audio (sem arquivos de áudio),
 * de propósito bem primitiva/curta pra combinar com a estética retrô do jogo.
 */
@Injectable({
    providedIn: 'root'
})
export class SomService {
    public clique() {
        this.tocar([0.35, 0.05, 440, 0, 0.02, 0.05, 1]);
    }

    public selecionar() {
        this.tocar([0.35, 0.05, 300, 0, 0.03, 0.08, 1, 1, 5]);
    }

    public sucesso() {
        this.tocar([0.45, 0.05, 520, 0, 0.05, 0.1, 1, 1, 0, 0, 300, 0.05]);
    }

    public erro() {
        this.tocar([0.45, 0.05, 150, 0, 0.08, 0.15, 2, 1, -6]);
    }

    /** Blip curtinho pro efeito de texto "digitando" nos diálogos. */
    public digitar() {
        this.tocar([0.15, 0.1, 700, 0, 0.02, 0.02, 1]);
    }

    private tocar(parametros: number[]) {
        try {
            ZZFX.audioContext.resume();
            ZZFX.play(...parametros);
        } catch {
            // Ambiente sem suporte a Web Audio — ignora silenciosamente.
        }
    }
}
