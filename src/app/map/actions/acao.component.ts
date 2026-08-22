import { Component, computed, inject, input, signal } from "@angular/core";
import { NgStyle } from "@angular/common";
import { BeeMapActionComponent } from "../../../ui/map";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ScreenService } from "../../../services/tela/screen.service";
import { MobileAcaoSelecionadaService } from "./mobile-acao-selecionada.component";
import { AcaoDoMapa } from "../../core/models/map/acao-do-mapa";
import { TipoAcao } from "../../core/models/map/tipo-acao";
import { TipoDesafio } from "../../core/models/desafios/tipo-desafio";
import { NiveisConcluidosAbelhaService } from "../../core/progresso/niveis-concluidos-abelha.service";
import { OnibusObtidoService } from "../../core/progresso/onibus-obtido.service";
import { AviaoObtidoService } from "../../core/progresso/aviao-obtido.service";
import { ProgressoMapaService } from "../../core/progresso/progresso-mapa.service";
import { MapaRepositoryService } from "../../core/seeds/repositories/mapa-repository.service";
import { MapaAtualService } from "../services/mapa-atual.service";
import { TAMANHO_TILE } from "../../core/constants/tile";
import { SomService } from "../../../services/som/som.service";
import {
    CAMINHO_TILESET_UTILITARIOS,
    COLUNAS_TILESET_UTILITARIOS,
    ICONE_ACAO_OBTIDO_POR_TIPO,
    ICONE_ACAO_POR_TIPO,
    ICONE_DESAFIO_CONCLUIDO_POR_TIPO,
    ICONE_DESAFIO_POR_TIPO
} from "../../core/constants/utilitarios";

@Component({
    selector: 'app-acao',
    template: `
    <bee-map-action [x]="mapActionData().x" [y]="mapActionData().y" [label]="mapActionData().label">
        <div class="relative">
            <div
                (click)="selecionar()"
                class="tile-icon hover:transition-all hover:-translate-y-0.5 duration-150 active:-translate-y-px"
                [class.cursor-pointer]="!bloqueado()"
                [class.cursor-not-allowed]="bloqueado()"
                [class.opacity-40]="bloqueado()"
                [class.grayscale]="bloqueado()"
                [ngStyle]="tileStyle()"></div>
            @if (bloqueado()) {
                <bee-icon icon="stop" [width]="10" class="absolute -top-1 -right-1" />
            }
        </div>
    </bee-map-action>
    `,
    imports: [BeeMapActionComponent, NgStyle, IconComponent]
})
export class AcaoComponent {
    readonly mobileAcaoSelecionadaService = inject(MobileAcaoSelecionadaService);
    readonly screenService = inject(ScreenService);
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);
    private readonly onibusObtidoService = inject(OnibusObtidoService);
    private readonly aviaoObtidoService = inject(AviaoObtidoService);
    private readonly progressoMapaService = inject(ProgressoMapaService);
    private readonly mapaRepositoryService = inject(MapaRepositoryService);
    private readonly mapaAtualService = inject(MapaAtualService);
    private readonly somService = inject(SomService);

    readonly isOpen = signal(false);
    readonly acao = input.required<AcaoDoMapa>();

    protected readonly mapActionData = computed(() => this.acao().toMapActionData());

    /** Ids em `niveisDependentes` que ainda não estão concluídos — vazio quando não há dependência pendente. */
    protected readonly dependenciasPendentes = computed(() => {
        const acao = this.acao();
        if (!acao.niveisDependentes.length) return false;

        const mapa = this.mapaAtualService.mapa();
        if (!mapa) return false;

        return acao.niveisDependentes.some(depId => {
            const dependencia = mapa.acoes.find(a => a.id === depId);
            return dependencia ? !this.progressoMapaService.estaConcluida(dependencia) : false;
        });
    });

    /**
     * Bloqueada por dependência não concluída, ou (só nesta fase do jogo) uma viagem (ônibus/avião)
     * pra uma região cujo mapa foi comentado (padrão ainda sem fases liberadas) — em ambos os casos
     * fica com estilo desabilitado em vez de sumir, e clicar mostra o aviso em vez de navegar/abrir.
     */
    protected readonly bloqueado = computed(() => {
        if (this.dependenciasPendentes()) return true;

        const acao = this.acao();
        if (acao.tipo !== TipoAcao.Onibus && acao.tipo !== TipoAcao.Aviao) return false;
        const destinoId = acao.mapaDestinoId;
        return !!destinoId && !this.mapaRepositoryService.findById(destinoId);
    });

    protected readonly tileIndex = computed(() => {
        const acao = this.acao();

        if (acao.tipo === TipoAcao.Desafio) {
            const tipoDesafio = acao.tipoDesafio ?? TipoDesafio.EncontreBug;
            const concluido = this.niveisConcluidosAbelhaService.estaConcluido(acao.id);
            return concluido ? ICONE_DESAFIO_CONCLUIDO_POR_TIPO[tipoDesafio] : ICONE_DESAFIO_POR_TIPO[tipoDesafio];
        }

        const obtido = acao.tipo === TipoAcao.Onibus
            ? this.onibusObtidoService.estaObtido(acao.id)
            : acao.tipo === TipoAcao.Aviao
                ? this.aviaoObtidoService.estaObtido(acao.id)
                : false;

        return (obtido ? ICONE_ACAO_OBTIDO_POR_TIPO[acao.tipo] : undefined) ?? ICONE_ACAO_POR_TIPO[acao.tipo] ?? 0;
    });

    protected readonly tileStyle = computed(() => {
        const tileIndex = this.tileIndex();
        const col = tileIndex % COLUNAS_TILESET_UTILITARIOS;
        const row = Math.floor(tileIndex / COLUNAS_TILESET_UTILITARIOS);

        return {
            backgroundImage: `url('${CAMINHO_TILESET_UTILITARIOS}')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${-col * TAMANHO_TILE}px ${-row * TAMANHO_TILE}px`,
            backgroundSize: 'auto',
        };
    });

    protected selecionar() {
        if (this.bloqueado()) {
            this.somService.erro();
            this.mobileAcaoSelecionadaService.selecionarBloqueado();
            return;
        }
        this.somService.selecionar();
        this.mobileAcaoSelecionadaService.selecionar(this.acao());
    }
}