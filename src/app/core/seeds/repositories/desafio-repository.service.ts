import { Injectable } from "@angular/core";
import { DesafiosSeeds } from "../data/desafios/desafios.seed";
import { Licao } from "../../models/desafios/licao/licao";
import { TipoDesafio } from "../../models/desafios/tipo-desafio";

@Injectable({
    providedIn: 'root'
})
export class DesafioRepositoryService {
    public findById(id: string) {
        return DesafiosSeeds.find(where => where.id == id);
    }

    /** Todas as Lições do jogo, de todos os padrões — base da Enciclopédia (livrinho do mapa). */
    public listarLicoes(): Licao[] {
        return DesafiosSeeds.filter((desafio): desafio is Licao => desafio.tipo === TipoDesafio.Licao);
    }
}
