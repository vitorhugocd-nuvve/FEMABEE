import { Injectable, effect, inject } from "@angular/core";
import { DialogoAtualService } from "./dialogo-atual.service";
import { LocalizacaoAtualService } from "./localizacao-atual.service";
import { NiveisConcluidosAbelhaService } from "../progresso/niveis-concluidos-abelha.service";
import { AparenciaObtidaService } from "../progresso/aparencia-obtida.service";
import { PassagemOnibusService } from "../progresso/passagem-onibus.service";
import { PassagemAviaoService } from "../progresso/passagem-aviao.service";
import { GatilhoDialogo } from "../models/dialogo/dialogo";
import { TipoGatilhoDialogo } from "../models/dialogo/tipo-gatilho-dialogo";
import { TipoAcao } from "../models/map/tipo-acao";
import { DialogosSeeds } from "../seeds/data/dialogos/dialogos.seed";

/**
 * Observa mapa atual, fases concluídas, compras e passagens — sempre que algo muda,
 * verifica se algum diálogo passou a satisfazer seu gatilho e o abre (um por vez).
 * Precisa ser instanciado eagerly (injetado em `App`) pra esses efeitos rodarem desde o início.
 */
@Injectable({
    providedIn: 'root'
})
export class DialogoGatilhoService {
    private readonly dialogoAtualService = inject(DialogoAtualService);
    private readonly localizacaoAtualService = inject(LocalizacaoAtualService);
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);
    private readonly aparenciaObtidaService = inject(AparenciaObtidaService);
    private readonly passagemOnibusService = inject(PassagemOnibusService);
    private readonly passagemAviaoService = inject(PassagemAviaoService);

    private readonly todos = DialogosSeeds;

    constructor() {
        effect(() => { this.localizacaoAtualService.mapaAtualId(); this.verificar(); });
        effect(() => { this.niveisConcluidosAbelhaService.ultimoConcluido(); this.verificar(); });
        effect(() => { this.aparenciaObtidaService.quantidadeObtida(); this.verificar(); });
        effect(() => { this.passagemOnibusService.quantidade(); this.verificar(); });
        effect(() => { this.passagemAviaoService.quantidade(); this.verificar(); });
        // Reavalia assim que um diálogo fecha, pra encadear o próximo que já esteja satisfeito.
        effect(() => { if (!this.dialogoAtualService.dialogoAtivo()) this.verificar(); });
    }

    private verificar(): void {
        for (const dialogo of this.todos) {
            if (this.satisfaz(dialogo.gatilho)) {
                this.dialogoAtualService.abrir(dialogo.id);
            }
        }
    }

    private satisfaz(gatilho: GatilhoDialogo): boolean {
        switch (gatilho.tipo) {
            case TipoGatilhoDialogo.AoEntrarNoMapa:
                return this.localizacaoAtualService.mapaAtualId() === gatilho.mapaId;

            case TipoGatilhoDialogo.AoConcluirFase:
                return this.niveisConcluidosAbelhaService.estaConcluido(gatilho.acaoId);

            case TipoGatilhoDialogo.AoComprarRoupas:
                return this.aparenciaObtidaService.quantidadeObtida() >= gatilho.meta;

            case TipoGatilhoDialogo.AoObterPassagens: {
                const servico = gatilho.tipoPassagem === TipoAcao.Onibus ? this.passagemOnibusService : this.passagemAviaoService;
                return servico.quantidade() >= gatilho.meta;
            }
        }
    }
}
