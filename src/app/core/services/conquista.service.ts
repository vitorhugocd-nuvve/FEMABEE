import { computed, Injectable, inject, signal } from "@angular/core";
import { Conquista, CondicaoConquista } from "../models/conquistas/conquista";
import { TipoCondicaoConquista } from "../models/conquistas/tipo-condicao-conquista";
import { ConquistasSeeds } from "../seeds/data/conquistas/conquistas.seed";
import { LojasSeeds } from "../seeds/data/lojas/lojas.seed";
import { NiveisConcluidosAbelhaService } from "../progresso/niveis-concluidos-abelha.service";
import { ProgressoMapaService } from "../progresso/progresso-mapa.service";
import { SequenciaSemErrarService } from "../progresso/sequencia-sem-errar.service";
import { AparenciaObtidaService } from "../progresso/aparencia-obtida.service";
import { MapaRepositoryService } from "../seeds/repositories/mapa-repository.service";

export type ConquistaComEstado = {
    conquista: Conquista;
    desbloqueada: boolean;
}

/** Motor de conquistas: guarda quais estão desbloqueadas e reavalia as condições de cada uma. */
@Injectable({
    providedIn: 'root'
})
export class ConquistaService {
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);
    private readonly progressoMapaService = inject(ProgressoMapaService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly aparenciaObtidaService = inject(AparenciaObtidaService);
    private readonly mapaRepositoryService = inject(MapaRepositoryService);

    private readonly _desbloqueadas = signal<Set<string>>(new Set());

    public readonly todas: Conquista[] = ConquistasSeeds;

    public readonly comEstado = computed<ConquistaComEstado[]>(() => {
        const desbloqueadas = this._desbloqueadas();
        return this.todas.map(conquista => ({ conquista, desbloqueada: desbloqueadas.has(conquista.id) }));
    });

    /** Reavalia todas as conquistas ainda não desbloqueadas contra o estado atual do jogo. */
    public verificar(): void {
        for (const conquista of this.todas) {
            if (this._desbloqueadas().has(conquista.id)) continue;
            if (this.satisfaz(conquista.condicao)) {
                this._desbloqueadas.update(atual => new Set(atual).add(conquista.id));
            }
        }
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
        }
    }
}
