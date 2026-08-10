import { computed, Injectable, signal } from "@angular/core";
import { Aparencia } from "../models/aparencia/aparencia";

/** Ids de aparência já possuídos por padrão, só pra ter algo pra testar o guarda-roupa antes de comprar qualquer coisa. */
const IDS_OBTIDOS_PARA_TESTE = [1, 3, 5, 9, 10, 12, 15];

/**
 * Mock: quais aparências (itens da loja) o jogador já possui.
 * O botão "Comprar" da loja marca o item obtido daqui pra frente.
 */
@Injectable({
    providedIn: 'root'
})
export class AparenciaObtidaService {
    private readonly _obtidas = signal<Set<number>>(new Set(IDS_OBTIDOS_PARA_TESTE));

    public readonly quantidadeObtida = computed(() => this._obtidas().size);

    public possui(aparenciaId: number): boolean {
        return this._obtidas().has(aparenciaId);
    }

    public marcarObtida(aparenciaId: number): void {
        if (this._obtidas().has(aparenciaId)) return;
        this._obtidas.update(atual => new Set(atual).add(aparenciaId));
    }

    public possuiTodas(itens: Aparencia[]): boolean {
        return itens.length > 0 && itens.every(item => this.possui(item.id));
    }
}
