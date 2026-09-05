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

    /**
     * Chamado por quem exibiu o toast, logo depois de exibir — sem isso, `_pendente` (um
     * `providedIn: 'root'`, sobrevive à recriação de componentes) ficava setado pra sempre, e
     * uma instância nova do indicator (ex.: `GameShellComponent` recriado ao trocar de abelha,
     * já que passa por `/abelhas`) reexibia a MESMA conquista antiga pra abelha errada, na hora
     * em que o efeito que a mostra roda pela primeira vez.
     */
    public consumirPendente(): void {
        this._pendente.set(null);
    }

    public readonly comEstado = computed<ConquistaComEstado[]>(() =>
        this.todas.map(conquista => ({
            conquista,
            desbloqueada: this.abelhaProgressoService.estaConquistaDesbloqueada(conquista.id)
        }))
    );

    /**
     * Reavalia todas as conquistas ainda não desbloqueadas contra o estado atual do jogo.
     * Não faz nada até TODO progresso relevante da abelha atual terminar de carregar do backend
     * — não só `conquistasCarregadas`. Sem isso, ao trocar de abelha (ou no boot), essa checagem
     * podia rodar com o Set de conquistas já carregado mas fases/aparências/sequência da abelha
     * NOVA ainda não — cada condição usa um desses, e avaliar contra dado que ainda não chegou
     * (ou que a troca de abelha ainda não zerou) pode tanto deixar de conceder uma conquista
     * legítima quanto conceder uma que a abelha atual não ganhou de verdade.
     */
    public verificar(): void {
        const conquistasCarregadas = this.abelhaProgressoService.conquistasCarregadas();
        const fasesGlobaisCarregadas = this.abelhaProgressoService.fasesGlobaisCarregadas();
        const aparenciasCarregadas = this.aparenciaObtidaService.carregado();
        const sequenciaCarregada = this.sequenciaSemErrarService.carregado();

        console.log(`[CONQUISTA] verificar() chamado`, {
            conquistasCarregadas, fasesGlobaisCarregadas, aparenciasCarregadas, sequenciaCarregada,
        });

        if (!conquistasCarregadas) { console.log('[CONQUISTA] abortando: conquistasCarregadas=false'); return; }
        if (!fasesGlobaisCarregadas) { console.log('[CONQUISTA] abortando: fasesGlobaisCarregadas=false'); return; }
        if (!aparenciasCarregadas) { console.log('[CONQUISTA] abortando: aparenciasCarregadas=false'); return; }
        if (!sequenciaCarregada) { console.log('[CONQUISTA] abortando: sequenciaCarregada=false'); return; }

        console.log('[CONQUISTA] todos os gates ok, avaliando', this.todas.length, 'conquistas');

        for (const conquista of this.todas) {
            const jaDesbloqueada = this.abelhaProgressoService.estaConquistaDesbloqueada(conquista.id);
            if (jaDesbloqueada) {
                console.log(`[CONQUISTA] "${conquista.id}" já desbloqueada, pulando`);
                continue;
            }

            const satisfeita = this.satisfaz(conquista.condicao);
            console.log(`[CONQUISTA] "${conquista.id}" (${conquista.condicao.tipo}) satisfaz()=${satisfeita}`, conquista.condicao);

            if (satisfeita) {
                console.log(`[CONQUISTA] >>> DESBLOQUEANDO "${conquista.id}" agora <<<`);
                this.abelhaProgressoService.marcarConquistaDesbloqueada(conquista.id);
                this.anunciar(conquista);
            }
        }
    }

    private anunciar(conquista: Conquista): void {
        console.log(`[CONQUISTA] anunciar("${conquista.id}") — setando _pendente`);
        this.somService.sucesso();
        this._pendente.set(new Indication({
            title: 'Conquista desbloqueada!',
            message: `${conquista.titulo} — ${conquista.descricao}`,
            icon: conquista.icone,
            severity: 'conquista',
            ttlInMs: 4500,
            toast: true,
            toastPosition: 'top',
        }));
    }

    private satisfaz(condicao: CondicaoConquista): boolean {
        switch (condicao.tipo) {
            case TipoCondicaoConquista.FasesConcluidas: {
                const atual = this.niveisConcluidosAbelhaService.quantidadeConcluida();
                console.log(`[CONQUISTA][satisfaz] FasesConcluidas: atual=${atual} meta=${condicao.meta}`);
                return atual >= condicao.meta;
            }

            case TipoCondicaoConquista.FaseEspecifica: {
                const resultado = this.niveisConcluidosAbelhaService.estaConcluidoGlobal(condicao.acaoId);
                console.log(`[CONQUISTA][satisfaz] FaseEspecifica: acaoId="${condicao.acaoId}" resultado=${resultado}`);
                return resultado;
            }

            case TipoCondicaoConquista.RegiaoEspecifica: {
                const mapa = this.mapaRepositoryService.findById(condicao.mapaId);
                const resultado = !!mapa && this.progressoMapaService.mapaCompletoGlobal(mapa);
                console.log(`[CONQUISTA][satisfaz] RegiaoEspecifica: mapaId="${condicao.mapaId}" mapaEncontrado=${!!mapa} resultado=${resultado}`);
                return resultado;
            }

            case TipoCondicaoConquista.SequenciaSemErrar: {
                const atual = this.sequenciaSemErrarService.sequenciaAtual();
                console.log(`[CONQUISTA][satisfaz] SequenciaSemErrar: atual=${atual} meta=${condicao.meta}`);
                return atual >= condicao.meta;
            }

            case TipoCondicaoConquista.ComprasCompletas: {
                const itens = LojasSeeds.flatMap(loja => loja.aparenciasDisponiveis)
                    .filter(item => item.tipo === condicao.tipoAparencia);
                const resultado = this.aparenciaObtidaService.possuiTodas(itens);
                console.log(`[CONQUISTA][satisfaz] ComprasCompletas: tipoAparencia="${condicao.tipoAparencia}" totalItens=${itens.length} resultado=${resultado}`);
                return resultado;
            }

            case TipoCondicaoConquista.AparenciasObtidas: {
                const atual = this.aparenciaObtidaService.quantidadeObtida();
                console.log(`[CONQUISTA][satisfaz] AparenciasObtidas: atual=${atual} meta=${condicao.meta}`);
                return atual >= condicao.meta;
            }
        }
    }
}
