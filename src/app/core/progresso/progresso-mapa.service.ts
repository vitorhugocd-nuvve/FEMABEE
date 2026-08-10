import { Injectable, inject } from "@angular/core";
import { AcaoDoMapa } from "../models/map/acao-do-mapa";
import { Mapa } from "../models/map/mapa";
import { TipoAcao } from "../models/map/tipo-acao";
import { NiveisConcluidosAbelhaService } from "./niveis-concluidos-abelha.service";
import { OnibusObtidoService } from "./onibus-obtido.service";
import { AviaoObtidoService } from "./aviao-obtido.service";

/** "Fases" de um mapa = ações que não são Loja (Desafio, Onibus, Aviao). */
@Injectable({
    providedIn: 'root'
})
export class ProgressoMapaService {
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);
    private readonly onibusObtidoService = inject(OnibusObtidoService);
    private readonly aviaoObtidoService = inject(AviaoObtidoService);

    public estaConcluida(acao: AcaoDoMapa): boolean {
        switch (acao.tipo) {
            case TipoAcao.Desafio: return this.niveisConcluidosAbelhaService.estaConcluido(acao.id);
            case TipoAcao.Onibus: return this.onibusObtidoService.estaObtido(acao.id);
            case TipoAcao.Aviao: return this.aviaoObtidoService.estaObtido(acao.id);
            default: return false;
        }
    }

    public fases(mapa: Mapa): AcaoDoMapa[] {
        return mapa.acoes.filter(acao => acao.tipo !== TipoAcao.Loja);
    }

    public progresso(mapa: Mapa): { total: number; concluidas: number } {
        const fases = this.fases(mapa);
        return { total: fases.length, concluidas: fases.filter(fase => this.estaConcluida(fase)).length };
    }

    public mapaCompleto(mapa: Mapa): boolean {
        const fases = this.fases(mapa);
        return fases.length > 0 && fases.every(fase => this.estaConcluida(fase));
    }
}
