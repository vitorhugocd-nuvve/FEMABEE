import { Component, computed, inject, input, signal } from "@angular/core";
import { NgStyle } from "@angular/common";
import { BeeMapActionComponent } from "../../../ui/map";
import { ScreenService } from "../../../services/tela/screen.service";
import { MobileAcaoSelecionadaService } from "./mobile-acao-selecionada.component";
import { AcaoDoMapa } from "../../core/models/map/acao-do-mapa";
import { TipoAcao } from "../../core/models/map/tipo-acao";
import { TipoDesafio } from "../../core/models/desafios/tipo-desafio";
import { NiveisConcluidosAbelhaService } from "../../core/progresso/niveis-concluidos-abelha.service";
import { OnibusObtidoService } from "../../core/progresso/onibus-obtido.service";
import { AviaoObtidoService } from "../../core/progresso/aviao-obtido.service";
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
        <div>
            <div (click)="selecionar()" class="tile-icon cursor-pointer hover:transition-all hover:-translate-y-0.5 duration-150 active:-translate-y-px" [ngStyle]="tileStyle()"></div>
            <!-- @if (screenService.isMobile()) {
            } @else {
                <div zPopover [zContent]="popoverContent" class="tile-icon cursor-pointer hover:transition-all hover:-translate-y-0.5 duration-150 active:-translate-y-px" [ngStyle]="tileStyle()"></div>
                <ng-template #popoverContent>
                    <z-popover>
                        <app-desafio-action />
                    </z-popover>
                </ng-template>
            } -->
        </div>
    </bee-map-action>
    `,
    imports: [BeeMapActionComponent, NgStyle]
})
export class AcaoComponent {
    readonly mobileAcaoSelecionadaService = inject(MobileAcaoSelecionadaService);
    readonly screenService = inject(ScreenService);
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);
    private readonly onibusObtidoService = inject(OnibusObtidoService);
    private readonly aviaoObtidoService = inject(AviaoObtidoService);
    private readonly somService = inject(SomService);

    readonly isOpen = signal(false);
    readonly acao = input.required<AcaoDoMapa>();

    protected readonly mapActionData = computed(() => this.acao().toMapActionData());

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
        this.somService.selecionar();
        this.mobileAcaoSelecionadaService.selecionar(this.acao());
    }
}