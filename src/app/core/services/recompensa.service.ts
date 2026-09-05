import { inject, Injectable, signal } from "@angular/core";
import { AbelhaEconomiaService } from "../jogador/abelha-economia.service";
import { AparenciaObtidaService } from "../progresso/aparencia-obtida.service";
import { LojaRepositoryService } from "../seeds/repositories/loja-repository.service";
import { Recompensa } from "../models/recompensa/recompensa";
import { TipoRecompensa } from "../models/recompensa/tipo-recompensa";
import { SomService } from "../../../services/som/som.service";
import { Indication } from "../../../ui/indicator/indication";

/**
 * Concede as recompensas de uma fase (dinheiro, passagens, aparências) e anuncia todas juntas
 * num único toast — chamado de `ConquistaProgressoService`, uma única vez por fase (guard de
 * "já concluída" já vem de lá). O toast fica no topo pra não colidir com o de acerto/erro do
 * próprio desafio, que usa o rodapé.
 */
@Injectable({ providedIn: 'root' })
export class RecompensaService {
    private readonly abelhaEconomiaService = inject(AbelhaEconomiaService);
    private readonly aparenciaObtidaService = inject(AparenciaObtidaService);
    private readonly lojaRepositoryService = inject(LojaRepositoryService);
    private readonly somService = inject(SomService);

    private readonly _pendente = signal<Indication | null>(null);
    readonly pendente = this._pendente.asReadonly();

    /**
     * Chamado por quem exibiu o toast, logo depois de exibir — sem isso, `_pendente` (um
     * `providedIn: 'root'`, sobrevive à recriação de componentes) ficava setado pra sempre, e
     * uma instância nova do indicator (ex.: `GameShellComponent` recriado ao trocar de abelha,
     * já que passa por `/abelhas`) reexibia o MESMO toast antigo pra abelha errada, na hora em
     * que o efeito que o mostra roda pela primeira vez.
     */
    consumirPendente(): void {
        this._pendente.set(null);
    }

    async conceder(recompensas: Recompensa[]): Promise<void> {
        const itens: string[] = [];
        for (const recompensa of recompensas) {
            const item = await this.aplicarUma(recompensa);
            if (item) itens.push(item);
        }
        if (itens.length) this.anunciar(itens);
    }

    /** Aplica uma recompensa e devolve sua descrição curta pro toast — `undefined` se não houve nada a conceder. */
    private async aplicarUma(recompensa: Recompensa): Promise<string | undefined> {
        switch (recompensa.tipo) {
            case TipoRecompensa.Dinheiro: {
                const valor = recompensa.valor ?? 0;
                if (valor <= 0) return undefined;
                await this.abelhaEconomiaService.ganharDinheiro(valor);
                return `${valor} moedas`;
            }
            case TipoRecompensa.PassagemContinental: {
                await this.abelhaEconomiaService.ganharPassagemContinental();
                return 'uma passagem de avião';
            }
            case TipoRecompensa.PassagemRegional: {
                await this.abelhaEconomiaService.ganharPassagemRegional();
                return 'uma passagem de ônibus';
            }
            case TipoRecompensa.Aparencia: {
                const id = recompensa.aparenciaId;
                if (id === undefined) return undefined;
                this.aparenciaObtidaService.marcarObtida(id);
                return this.lojaRepositoryService.findAparenciaById(id)?.nome ?? 'um item novo';
            }
        }
    }

    private anunciar(itens: string[]): void {
        this.somService.sucesso();
        const mensagem = itens.length === 1
            ? `Você ganhou ${itens[0]}!`
            : `Você ganhou: ${itens.join(', ')}!`;

        this._pendente.set(new Indication({
            title: 'Recompensa!',
            message: mensagem,
            icon: 'gift',
            severity: 'success',
            ttlInMs: 3500,
            toast: true,
            toastPosition: 'top',
        }));
    }
}
