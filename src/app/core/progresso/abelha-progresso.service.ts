import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_BASE_URL } from "../constants/api";
import { RespostaApi } from "../http/resposta-api";
import { AbelhaSelecionadaService } from "../jogador/abelha-selecionada.service";
import { LocalizacaoAtualService } from "../services/localizacao-atual.service";

type RegistroProgresso = {
    tipo: 'AREA' | 'FASE' | 'AEROPORTO' | 'ONIBUS';
    identificador: string;
};

/**
 * Progresso real (backend) de fases/aeroportos/ônibus/áreas desbloqueados. Os três primeiros
 * são carregados escopados ao mapa atualmente aberto (uma query só, via /progresso-mapa/:idMapa)
 * — é o que AcaoComponent usa pra saber se um ícone já foi concluído. O total de fases é
 * carregado à parte (sem escopo de mapa), porque a conquista "15 fases concluídas" conta o jogo
 * inteiro, não só o mapa aberto no momento.
 *
 * Escrita é otimista: atualiza o signal local na hora e dispara a persistência em paralelo, sem
 * aguardar — os pontos que chamam isso (ConquistaProgressoService, dentro de um effect()) esperam
 * `marcarConcluido`/`marcarObtido` síncronos, igual eram quando isso era mock puro.
 */
@Injectable({ providedIn: 'root' })
export class AbelhaProgressoService {
    private readonly http = inject(HttpClient);
    private readonly abelhaSelecionadaService = inject(AbelhaSelecionadaService);
    private readonly localizacaoAtualService = inject(LocalizacaoAtualService);

    private readonly _fasesConcluidasNoMapa = signal<Set<string>>(new Set());
    private readonly _aeroportosDesbloqueadosNoMapa = signal<Set<string>>(new Set());
    private readonly _onibusDesbloqueadosNoMapa = signal<Set<string>>(new Set());
    /** Ids de ação (fases) concluídas em QUALQUER mapa — usado pra "15 fases" e pra saber quais Lições já foram lidas (Enciclopédia). */
    private readonly _fasesConcluidasGlobal = signal<Set<string>>(new Set());
    private readonly _ultimaFaseConcluida = signal<string | undefined>(undefined);

    readonly ultimaFaseConcluida = this._ultimaFaseConcluida.asReadonly();

    constructor() {
        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            const idMapa = this.localizacaoAtualService.mapaAtualId();

            // Zera na hora, antes do fetch resolver: sem isso, ao trocar de mapa o Set do mapa
            // anterior continua valendo por um instante — se o novo mapa reusa o mesmo id de ação
            // (os ids de seed são simples, tipo "1"/"2", não únicos entre mapas), uma fase daquele
            // outro mapa aparece como concluída aqui por engano.
            this._fasesConcluidasNoMapa.set(new Set());
            this._aeroportosDesbloqueadosNoMapa.set(new Set());
            this._onibusDesbloqueadosNoMapa.set(new Set());

            if (abelha) this.carregarProgressoDoMapa(abelha.id, idMapa);
        });

        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            this._fasesConcluidasGlobal.set(new Set());
            if (abelha) this.carregarTotalFasesConcluidas(abelha.id);
        });
    }

    estaFaseConcluida(acaoId: string): boolean {
        return this._fasesConcluidasNoMapa().has(acaoId);
    }

    estaAeroportoDesbloqueado(acaoId: string): boolean {
        return this._aeroportosDesbloqueadosNoMapa().has(acaoId);
    }

    estaOnibusDesbloqueado(acaoId: string): boolean {
        return this._onibusDesbloqueadosNoMapa().has(acaoId);
    }

    /** Concluída em qualquer mapa (não só o atual) — ex.: pra saber se a Lição de uma fase já foi lida. */
    estaFaseConcluidaGlobal(acaoId: string): boolean {
        return this._fasesConcluidasGlobal().has(acaoId);
    }

    totalFasesConcluidas(): number {
        return this._fasesConcluidasGlobal().size;
    }

    marcarFaseConcluida(acaoId: string): void {
        if (this._fasesConcluidasNoMapa().has(acaoId)) return;
        this._fasesConcluidasNoMapa.update(atual => new Set(atual).add(acaoId));
        this._fasesConcluidasGlobal.update(atual => new Set(atual).add(acaoId));
        this._ultimaFaseConcluida.set(acaoId);
        this.persistir('fases-concluidas', { idFase: acaoId, idMapa: this.localizacaoAtualService.mapaAtualId() });
    }

    desbloquearAeroporto(acaoId: string): void {
        if (this._aeroportosDesbloqueadosNoMapa().has(acaoId)) return;
        this._aeroportosDesbloqueadosNoMapa.update(atual => new Set(atual).add(acaoId));
        this.persistir('aeroportos-desbloqueados', { idAeroporto: acaoId, idMapa: this.localizacaoAtualService.mapaAtualId() });
    }

    desbloquearOnibus(acaoId: string): void {
        if (this._onibusDesbloqueadosNoMapa().has(acaoId)) return;
        this._onibusDesbloqueadosNoMapa.update(atual => new Set(atual).add(acaoId));
        this.persistir('passagens-onibus-desbloqueadas', { idPontoOnibus: acaoId, idMapa: this.localizacaoAtualService.mapaAtualId() });
    }

    /** Sem cache local (nada lê "área desbloqueada" no front ainda) — só persiste. */
    desbloquearArea(idMapa: string): void {
        this.persistir('areas-desbloqueadas', { idMapa });
    }

    private async carregarProgressoDoMapa(idAbelha: string, idMapa: string): Promise<void> {
        const resposta = await firstValueFrom(
            this.http.get<RespostaApi<RegistroProgresso[]>>(`${API_BASE_URL}/abelha/${idAbelha}/progresso-mapa/${idMapa}`),
        );

        const porTipo = (tipo: RegistroProgresso['tipo']) =>
            new Set(resposta.dados.filter(registro => registro.tipo === tipo).map(registro => registro.identificador));

        this._fasesConcluidasNoMapa.set(porTipo('FASE'));
        this._aeroportosDesbloqueadosNoMapa.set(porTipo('AEROPORTO'));
        this._onibusDesbloqueadosNoMapa.set(porTipo('ONIBUS'));
    }

    private async carregarTotalFasesConcluidas(idAbelha: string): Promise<void> {
        const resposta = await firstValueFrom(
            this.http.get<RespostaApi<RegistroProgresso[]>>(`${API_BASE_URL}/abelha/${idAbelha}/fases-concluidas`),
        );
        this._fasesConcluidasGlobal.set(new Set(resposta.dados.map(registro => registro.identificador)));
    }

    private persistir(caminho: string, body: Record<string, string>): void {
        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        if (!idAbelha) return;
        firstValueFrom(this.http.post(`${API_BASE_URL}/abelha/${idAbelha}/${caminho}`, body)).catch(() => {});
    }
}
