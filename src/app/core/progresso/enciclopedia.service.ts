import { computed, Injectable, inject } from "@angular/core";
import { DesafioRepositoryService } from "../seeds/repositories/desafio-repository.service";
import { MapaRepositoryService } from "../seeds/repositories/mapa-repository.service";
import { AbelhaProgressoService } from "./abelha-progresso.service";
import { Licao } from "../models/desafios/licao/licao";
import { TipoDesafio } from "../models/desafios/tipo-desafio";

export type EntradaEnciclopedia = {
    licao: Licao;
    desbloqueada: boolean;
};

export type GrupoEnciclopedia = {
    grupo: string;
    padroes: { padrao: string; entradas: EntradaEnciclopedia[] }[];
};

/**
 * Deriva o sumário da Enciclopédia (livrinho do mapa) a partir das Lições cadastradas nos seeds:
 * cada Lição fica "desbloqueada" pra leitura assim que a fase (AcaoDoMapa) que a abre é concluída
 * em qualquer mapa — por isso cruza com `AbelhaProgressoService.estaFaseConcluidaGlobal`, não com
 * o progresso escopado ao mapa aberto no momento.
 */
@Injectable({ providedIn: 'root' })
export class EnciclopediaService {
    private readonly desafioRepositoryService = inject(DesafioRepositoryService);
    private readonly mapaRepositoryService = inject(MapaRepositoryService);
    private readonly abelhaProgressoService = inject(AbelhaProgressoService);

    /** desafioId da Lição -> ids de ação (em qualquer mapa) que a abrem. Estático: seeds não mudam em runtime. */
    private readonly acaoIdsPorLicao = this.construirAcaoIdsPorLicao();

    /** Todas as Lições do jogo com seu estado de desbloqueio, na ordem em que aparecem nos seeds. */
    readonly entradas = computed<EntradaEnciclopedia[]>(() =>
        this.desafioRepositoryService.listarLicoes().map(licao => {
            const acaoIds = this.acaoIdsPorLicao.get(licao.id) ?? [];
            const desbloqueada = acaoIds.some(acaoId => this.abelhaProgressoService.estaFaseConcluidaGlobal(acaoId));
            return { licao, desbloqueada };
        })
    );

    /** Sumário agrupado por grupo (Criacionais/Comportamentais/Estruturais) e depois por padrão. */
    readonly sumario = computed<GrupoEnciclopedia[]>(() => {
        const grupos = new Map<string, Map<string, EntradaEnciclopedia[]>>();

        for (const entrada of this.entradas()) {
            const porPadrao = grupos.get(entrada.licao.grupo) ?? new Map<string, EntradaEnciclopedia[]>();
            grupos.set(entrada.licao.grupo, porPadrao);

            const lista = porPadrao.get(entrada.licao.padrao) ?? [];
            lista.push(entrada);
            porPadrao.set(entrada.licao.padrao, lista);
        }

        return Array.from(grupos.entries()).map(([grupo, porPadrao]) => ({
            grupo,
            padroes: Array.from(porPadrao.entries()).map(([padrao, entradas]) => ({ padrao, entradas })),
        }));
    });

    private construirAcaoIdsPorLicao(): Map<string, string[]> {
        const mapa = new Map<string, string[]>();

        for (const m of this.mapaRepositoryService.listarTodos()) {
            for (const acao of m.acoes) {
                if (acao.tipoDesafio !== TipoDesafio.Licao || !acao.desafioId) continue;
                const lista = mapa.get(acao.desafioId) ?? [];
                lista.push(acao.id);
                mapa.set(acao.desafioId, lista);
            }
        }

        return mapa;
    }
}
