import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_BASE_URL } from "../constants/api";
import { RespostaApi } from "../http/resposta-api";
import { AbelhaSelecionadaService } from "../jogador/abelha-selecionada.service";
import { LocalizacaoAtualService } from "../services/localizacao-atual.service";

type RegistroProgresso = {
    tipo: 'AREA' | 'FASE' | 'AEROPORTO' | 'ONIBUS' | 'DIALOGO' | 'CONQUISTA';
    identificador: string;
};

type RegistroTentativaFase = {
    tentativas: number;
    erros: number;
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
    /**
     * Mesmo princípio de `_dialogosCarregados`: evita `ConquistaService.verificar()` reavaliar
     * uma condição "fase específica"/"região específica" contra um Set ainda vazio (da abelha
     * recém-selecionada, cujo GET de fases concluídas ainda não resolveu) — sem isso, trocar de
     * abelha podia deixar a condição momentaneamente "não satisfeita" (a checagem simplesmente
     * não roda de novo depois que o Set carrega de verdade) OU, pior, satisfeita por engano se
     * outro Set relacionado ainda estivesse com dado da abelha anterior nesse meio-tempo.
     */
    private readonly _fasesGlobaisCarregadas = signal(false);
    private readonly _ultimaFaseConcluida = signal<string | undefined>(undefined);
    /** Ids de diálogo já exibidos (qualquer mapa) — pra não repetir o mesmo diálogo (ex.: boas-vindas) a cada login. */
    private readonly _dialogosConcluidos = signal<Set<string>>(new Set());
    /**
     * Só fica `true` depois da primeira carga (sucesso ou falha) de `_dialogosConcluidos`.
     * Existe pra quem decide se abre um diálogo (`DialogoGatilhoService`) esperar essa carga
     * antes de checar `estaDialogoConcluido` — sem isso, o gatilho "ao entrar no mapa" roda
     * de forma síncrona no boot, sempre antes do GET assíncrono resolver, e reabre diálogos
     * já vistos porque o Set local ainda está vazio (não porque o backend não tenha o registro).
     */
    private readonly _dialogosCarregados = signal(false);
    /** Soma de `tentativas` de todo o histórico de tentativas-fase da abelha — usado no Perfil. */
    private readonly _totalTentativas = signal(0);
    /** Ids de conquista já desbloqueadas — persistido, sobrevive a reload/login. */
    private readonly _conquistasDesbloqueadas = signal<Set<string>>(new Set());
    /** Mesmo princípio de `_dialogosCarregados`: evita `ConquistaService.verificar()` reavaliar contra um Set ainda vazio no boot, antes do GET resolver. */
    private readonly _conquistasCarregadas = signal(false);

    readonly ultimaFaseConcluida = this._ultimaFaseConcluida.asReadonly();
    readonly dialogosCarregados = this._dialogosCarregados.asReadonly();
    readonly conquistasCarregadas = this._conquistasCarregadas.asReadonly();
    readonly fasesGlobaisCarregadas = this._fasesGlobaisCarregadas.asReadonly();

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
            console.log(`[ABELHA-PROGRESSO] efeito fasesGlobal: abelha=${abelha?.id ?? 'null'} — zerando e (re)carregando`);
            this._fasesConcluidasGlobal.set(new Set());
            this._fasesGlobaisCarregadas.set(false);
            if (abelha) this.carregarTotalFasesConcluidas(abelha.id);
        });

        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            this._dialogosConcluidos.set(new Set());
            this._dialogosCarregados.set(false);
            if (abelha) this.carregarDialogosConcluidos(abelha.id);
        });

        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            this._totalTentativas.set(0);
            if (abelha) this.carregarTotalTentativas(abelha.id);
        });

        effect(() => {
            const abelha = this.abelhaSelecionadaService.abelha();
            console.log(`[ABELHA-PROGRESSO] efeito conquistas: abelha=${abelha?.id ?? 'null'} — zerando e (re)carregando`);
            this._conquistasDesbloqueadas.set(new Set());
            this._conquistasCarregadas.set(false);
            if (abelha) this.carregarConquistasDesbloqueadas(abelha.id);
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

    estaDialogoConcluido(dialogoId: string): boolean {
        return this._dialogosConcluidos().has(dialogoId);
    }

    /** Soma de tentativas em todas as fases já concluídas (com sucesso ou não) — exibido no Perfil. */
    totalTentativas(): number {
        return this._totalTentativas();
    }

    estaConquistaDesbloqueada(conquistaId: string): boolean {
        return this._conquistasDesbloqueadas().has(conquistaId);
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

    /** Resumo de tentativas ao concluir uma fase ("tentou N vezes, errou M") — atualiza o total local e persiste. */
    registrarTentativaFase(idFase: string, idMapa: string, tentativas: number, erros: number): void {
        this._totalTentativas.update(atual => atual + tentativas);
        this.persistir('tentativas-fase', { idFase, idMapa, tentativas, erros });
    }

    /** Marca um diálogo como já exibido — não repete mais, em nenhum login/dispositivo. */
    marcarDialogoConcluido(dialogoId: string): void {
        if (this._dialogosConcluidos().has(dialogoId)) return;
        this._dialogosConcluidos.update(atual => new Set(atual).add(dialogoId));
        this.persistir('dialogos-concluidos', { idDialogo: dialogoId, idMapa: this.localizacaoAtualService.mapaAtualId() });
    }

    /** Marca uma conquista como desbloqueada — permanente, sobrevive a reload/login. */
    marcarConquistaDesbloqueada(conquistaId: string): void {
        const idAbelhaAtual = this.abelhaSelecionadaService.abelha()?.id;
        if (this._conquistasDesbloqueadas().has(conquistaId)) {
            console.log(`[ABELHA-PROGRESSO] marcarConquistaDesbloqueada("${conquistaId}") ignorado, já estava no Set local (abelha=${idAbelhaAtual})`);
            return;
        }
        console.log(`[ABELHA-PROGRESSO] marcarConquistaDesbloqueada("${conquistaId}") para abelha=${idAbelhaAtual}`);
        this._conquistasDesbloqueadas.update(atual => new Set(atual).add(conquistaId));
        this.persistir('conquistas-desbloqueadas', { idConquista: conquistaId, idMapa: this.localizacaoAtualService.mapaAtualId() });
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
        try {
            const resposta = await firstValueFrom(
                this.http.get<RespostaApi<RegistroProgresso[]>>(`${API_BASE_URL}/abelha/${idAbelha}/fases-concluidas`),
            );
            const ids = resposta.dados.map(registro => registro.identificador);
            console.log(`[ABELHA-PROGRESSO] GET fases-concluidas OK pra abelha=${idAbelha}:`, ids);
            this._fasesConcluidasGlobal.set(new Set(ids));
        } catch (erro) {
            console.error(`[ABELHA-PROGRESSO] GET fases-concluidas FALHOU pra abelha=${idAbelha}`, erro);
        } finally {
            this._fasesGlobaisCarregadas.set(true);
        }
    }

    private async carregarDialogosConcluidos(idAbelha: string): Promise<void> {
        try {
            const resposta = await firstValueFrom(
                this.http.get<RespostaApi<RegistroProgresso[]>>(`${API_BASE_URL}/abelha/${idAbelha}/dialogos-concluidos`),
            );
            this._dialogosConcluidos.set(new Set(resposta.dados.map(registro => registro.identificador)));
        } finally {
            // Mesmo se a busca falhar, libera quem está esperando — melhor arriscar repetir um
            // diálogo ocasionalmente (falha de rede) do que travar todo o sistema de diálogos.
            this._dialogosCarregados.set(true);
        }
    }

    private async carregarConquistasDesbloqueadas(idAbelha: string): Promise<void> {
        try {
            const resposta = await firstValueFrom(
                this.http.get<RespostaApi<RegistroProgresso[]>>(`${API_BASE_URL}/abelha/${idAbelha}/conquistas-desbloqueadas`),
            );
            const ids = resposta.dados.map(registro => registro.identificador);
            console.log(`[ABELHA-PROGRESSO] GET conquistas-desbloqueadas OK pra abelha=${idAbelha}:`, ids);
            this._conquistasDesbloqueadas.set(new Set(ids));
        } catch (erro) {
            console.error(`[ABELHA-PROGRESSO] GET conquistas-desbloqueadas FALHOU pra abelha=${idAbelha}`, erro);
        } finally {
            this._conquistasCarregadas.set(true);
        }
    }

    private async carregarTotalTentativas(idAbelha: string): Promise<void> {
        const resposta = await firstValueFrom(
            this.http.get<RespostaApi<RegistroTentativaFase[]>>(`${API_BASE_URL}/abelha/${idAbelha}/tentativas-fase`),
        );
        this._totalTentativas.set(resposta.dados.reduce((soma, registro) => soma + registro.tentativas, 0));
    }

    private persistir(caminho: string, body: Record<string, string | number>): void {
        const idAbelha = this.abelhaSelecionadaService.abelha()?.id;
        if (!idAbelha) {
            console.warn(`[ABELHA-PROGRESSO] persistir("${caminho}") abortado: nenhuma abelha selecionada`, body);
            return;
        }
        console.log(`[ABELHA-PROGRESSO] POST ${caminho} pra abelha=${idAbelha}`, body);
        firstValueFrom(this.http.post(`${API_BASE_URL}/abelha/${idAbelha}/${caminho}`, body))
            .then(() => console.log(`[ABELHA-PROGRESSO] POST ${caminho} OK pra abelha=${idAbelha}`))
            .catch((erro) => console.error(`[ABELHA-PROGRESSO] POST ${caminho} FALHOU pra abelha=${idAbelha}`, erro));
    }
}
