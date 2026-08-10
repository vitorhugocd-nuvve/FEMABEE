import { Injectable } from "@angular/core";
import { LojasSeeds } from "../data/lojas/lojas.seed";
import { Aparencia } from "../../models/aparencia/aparencia";
import { TipoAparencia } from "../../models/aparencia/tipo-aparencia";

@Injectable({
    providedIn: 'root'
})
export class LojaRepositoryService {
    public findById(id: string) {
        return LojasSeeds.find(where => where.id == id);
    }

    /** Todas as aparências à venda em qualquer loja, de um tipo específico — usado pelo guarda-roupa. */
    public aparenciasPorTipo(tipo: TipoAparencia): Aparencia[] {
        return this.todasAparencias().filter(aparencia => aparencia.tipo === tipo);
    }

    public findAparenciaById(id: number): Aparencia | undefined {
        return this.todasAparencias().find(aparencia => aparencia.id === id);
    }

    private todasAparencias(): Aparencia[] {
        return LojasSeeds.flatMap(loja => loja.aparenciasDisponiveis);
    }
}
