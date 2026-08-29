import { computed, Injectable, inject, signal } from "@angular/core";
import { Conquista, CondicaoConquista } from "../models/conquistas/conquista";
import { TipoCondicaoConquista } from "../models/conquistas/tipo-condicao-conquista";
import { ConquistasSeeds } from "../seeds/data/conquistas/conquistas.seed";
import { LojasSeeds } from "../seeds/data/lojas/lojas.seed";
import { NiveisConcluidosAbelhaService } from "../progresso/niveis-concluidos-abelha.service";
import { ProgressoMapaService } from "../progresso/progresso-mapa.service";
import { SequenciaSemErrarService } from "../progresso/sequencia-sem-errar.service";
import { AparenciaObtidaService } from "../progresso/aparencia-obtida.service";
import { AbelhaProgressoService } from "../progresso/abelha-progresso.service";
import { MapaRepositoryService } from "../seeds/repositories/mapa-repository.service";
import { SomService } from "../../../services/som/som.service";
import { Indication } from "../../../ui/indicator/indication";

export type ConquistaComEstado = {
    conquista: Conquista;
    desbloqueada: boolean;
}

/**
 * Motor de conquistas: reavalia as condições de cada uma contra o progresso real (persistido)
 * e marca as satisfeitas via `AbelhaProgressoService` — sobrevive a reload/login, em vez de um
 * Set em memória que reavaliava tudo do zero a cada boot.
 */
@Injectable({
    providedIn: 'root'
})
export class ConquistaService {
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);
    private readonly progressoMapaService = inject(ProgressoMapaService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly aparenciaObtidaService = inject(AparenciaObtidaService);
    private readonly mapaRepositoryService = inject(MapaRepositoryService);
    private readonly abelhaProgressoService = inject(AbelhaProgressoService);
    private readonly somService = inject(SomService);

    public readonly todas: Conquista[] = ConquistasSeeds;

    private readonly _pendente = signal<Indication | null>(null);
    /** Toast dourado a anunciar — `GameShellComponent` observa isso num `bee-indicator` global. */
    public readonly pendente = this._pendente.asReadonly();

    public readonly comEstado = computed<ConquistaComEstado[]>(() =>
        this.todas.map(conquista => ({
            conquista,
            desbloqueada: this.abelhaProgressoService.estaConquistaDesbloqueada(conquista.id)
        }))
    );

    /**
     * Reavalia todas as conquistas ainda não desbloqueadas contra o estado atual do jogo.
     * Não faz nada até `conquistasCarregadas` — sem isso, essa checagem roda no boot antes do
     * GET de conquistas-desbloqueadas resolver, e o Set local (ainda vazio) faria parecer que
     * nenhuma conquista foi desbloqueada, mesmo quando o backend já tem o registro.
     */
    public verificar(): void {
        if (!this.abelhaProgressoService.conquistasCarregadas()) return;

        for (const conquista of this.todas) {
            if (this.abelhaProgressoService.estaConquistaDesbloqueada(conquista.id)) continue;
            if (this.satisfaz(conquista.condicao)) {
                this.abelhaProgressoService.marcarConquistaDesbloqueada(conquista.id);
                this.anunciar(conquista);
            }
        }
    }

    private anunciar(conquista: Conquista): void {
        this.somService.sucesso();
        this._pendente.set(new Indication({
            title: 'Conquista desbloqueada!',
            message: `${conquista.titulo} — ${conquista.descricao}`,
            icon: conquista.icone,
            severity: 'conquista',
            ttlInMs: 4500,
            toast: true,
            toastPosition: 'center',
        }));
    }

    private satisfaz(condicao: CondicaoConquista): boolean {
        switch (condicao.tipo) {
            case TipoCondicaoConquista.FasesConcluidas:
                return this.niveisConcluidosAbelhaService.quantidadeConcluida() >= condicao.meta;

            case TipoCondicaoConquista.FaseEspecifica:
                return this.niveisConcluidosAbelhaService.estaConcluido(condicao.acaoId);

            case TipoCondicaoConquista.RegiaoEspecifica: {
                const mapa = this.mapaRepositoryService.findById(condicao.mapaId);
                return !!mapa && this.progressoMapaService.mapaCompleto(mapa);
            }

            case TipoCondicaoConquista.SequenciaSemErrar:
                return this.sequenciaSemErrarService.sequenciaAtual() >= condicao.meta;

            case TipoCondicaoConquista.ComprasCompletas: {
                const itens = LojasSeeds.flatMap(loja => loja.aparenciasDisponiveis)
                    .filter(item => item.tipo === condicao.tipoAparencia);
                return this.aparenciaObtidaService.possuiTodas(itens);
            }

            case TipoCondicaoConquista.AparenciasObtidas:
                return this.aparenciaObtidaService.quantidadeObtida() >= condicao.meta;
        }
    }
}
