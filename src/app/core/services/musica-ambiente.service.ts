import { effect, inject, Injectable } from "@angular/core";
import { MusicaService } from "../../../services/som/musica.service";
import { DesafioAtualService } from "./desafio-atual.service";
import { DialogoAtualService } from "./dialogo-atual.service";

/**
 * Serviço global: toca a trilha ambiente do mapa e abaixa o volume enquanto um
 * desafio ou diálogo está aberto por cima (são overlays, o mapa nunca desmonta).
 */
@Injectable({
    providedIn: 'root'
})
export class MusicaAmbienteService {
    private readonly musicaService = inject(MusicaService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly dialogoAtualService = inject(DialogoAtualService);

    constructor() {
        this.musicaService.iniciar();

        effect(() => {
            const overlayAberto = !!this.desafioAtualService.desafioAtivo() || !!this.dialogoAtualService.dialogoAtivo();
            if (overlayAberto) {
                this.musicaService.abaixarVolume();
            } else {
                this.musicaService.restaurarVolume();
            }
        });
    }
}
