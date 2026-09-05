import { Injectable, effect, inject, signal } from "@angular/core";
import { ID_MAPA_INICIAL } from "../seeds/data/maps/mapa-mundi";
import { AbelhaSelecionadaService } from "../jogador/abelha-selecionada.service";

/** Serviço global: em qual mapa a abelha está localizada agora, e a navegação entre mapas. */
@Injectable({
    providedIn: 'root'
})
export class LocalizacaoAtualService {
    private readonly abelhaSelecionadaService = inject(AbelhaSelecionadaService);

    private readonly _mapaAtualId = signal<string>(ID_MAPA_INICIAL);

    readonly mapaAtualId = this._mapaAtualId.asReadonly();

    constructor() {
        // Ao trocar de abelha, volta pro Mundi — sem isso, o mapa atual ficava com o valor
        // deixado pela abelha anterior (esse signal só muda via `irPara`, nunca é resetado
        // sozinho). Além de abrir a abelha nova direto numa região que ela nunca visitou, isso
        // fazia o progresso "do mapa atual" ser recarregado com o id do mapa errado logo na
        // troca, o que também podia atrapalhar checagens de conquista feitas nesse meio-tempo.
        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            console.log(`[LOCALIZACAO] efeito: abelha=${abelha?.id ?? 'null'} — resetando mapaAtualId pra "${ID_MAPA_INICIAL}"`);
            this._mapaAtualId.set(ID_MAPA_INICIAL);
        });
    }

    public irPara(mapaId: string) {
        console.log(`[LOCALIZACAO] irPara("${mapaId}")`);
        this._mapaAtualId.set(mapaId);
    }
}
