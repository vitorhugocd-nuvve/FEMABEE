import { computed, Injectable, signal } from "@angular/core";
import { DesafioBaseService } from "../desafio-base.service";
import { Licao } from "../../core/models/desafios/licao/licao";

@Injectable({ providedIn: 'root' })
export class LicaoService extends DesafioBaseService {
    private readonly _licao = signal<Licao | undefined>(undefined);
    private readonly _concluida = signal<boolean>(false);

    public readonly licao = this._licao.asReadonly();
    public readonly concluida = this._concluida.asReadonly();

    public readonly padrao = computed(() => this._licao()?.padrao);

    public iniciar(licao: Licao): void {
        this._licao.set(licao);
        this._concluida.set(false);
        this._progresso.set(0);
    }

    /** Marca a lição como lida — mock: substitua por chamada HTTP quando houver backend. */
    public async concluir(): Promise<void> {
        if (this._concluida() || this._solicitando()) return;
        await this.simularValidacao(undefined);
        this._concluida.set(true);
        this._progresso.set(100);
    }
}
