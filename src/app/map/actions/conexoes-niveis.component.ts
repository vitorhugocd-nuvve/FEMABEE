import { Component, computed, inject, input } from "@angular/core";
import { MapTileService } from "../../../ui/map";
import { AcaoDoMapa } from "../../core/models/map/acao-do-mapa";
import { NiveisConcluidosAbelhaService } from "../../core/progresso/niveis-concluidos-abelha.service";

type ConexaoNivel = {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    liberada: boolean;
};

/**
 * Desenha uma linha entre cada ação e suas dependências (`AcaoDoMapa.niveisDependentes`).
 * Vive dentro de `<bee-map>` como filho projetado, igual `<app-acao>` — por isso consegue
 * injetar o `MapTileService` provido pelo `bee-map` (o escopo de DI segue a árvore de
 * elementos renderizada, não onde o componente foi declarado).
 */
@Component({
    selector: 'app-conexoes-niveis',
    template: `
    <svg class="conexoes-niveis__svg">
        @for (conexao of conexoes(); track conexao.id) {
            <line
                [attr.x1]="conexao.x1" [attr.y1]="conexao.y1"
                [attr.x2]="conexao.x2" [attr.y2]="conexao.y2"
                class="conexoes-niveis__linha"
                [class.conexoes-niveis__linha--liberada]="conexao.liberada" />
        }
    </svg>
    `,
    styles: [`
    .conexoes-niveis__svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: none;
    }

    .conexoes-niveis__linha {
        stroke: #000;
        stroke-width: 2;
        stroke-dasharray: 5 5;
        opacity: 0.25;
        transition: opacity 200ms ease;
    }

    .conexoes-niveis__linha--liberada {
        stroke-dasharray: none;
        opacity: 0.85;
    }
    `],
    host: { style: 'display: contents' }
})
export class ConexoesNiveisComponent {
    private readonly tileService = inject(MapTileService);
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);

    readonly acoes = input.required<AcaoDoMapa[]>();

    protected readonly conexoes = computed<ConexaoNivel[]>(() => {
        const acoes = this.acoes();
        const porId = new Map(acoes.map(acao => [acao.id, acao]));
        const { width, height } = this.tileService.tileSize();

        const centro = (acao: AcaoDoMapa) => {
            const { left, top } = this.tileService.tileToPixel(acao.posicaoEmTiles().x, acao.posicaoEmTiles().y);
            return { x: left + width / 2, y: top + height / 2 };
        };

        const resultado: ConexaoNivel[] = [];
        for (const acao of acoes) {
            for (const dependeId of acao.niveisDependentes) {
                const dependencia = porId.get(dependeId);
                if (!dependencia) continue;

                const de = centro(dependencia);
                const para = centro(acao);
                resultado.push({
                    id: `${dependeId}->${acao.id}`,
                    x1: de.x,
                    y1: de.y,
                    x2: para.x,
                    y2: para.y,
                    liberada: this.niveisConcluidosAbelhaService.estaConcluido(dependeId)
                });
            }
        }
        return resultado;
    });
}
