import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { Aparencia } from "../../app/core/models/aparencia/aparencia";
import { TamanhoAbelha } from "../../app/core/models/aparencia/tamanhos";
import {
    CAMINHO_IMAGEM_BASE_ABELHA,
    LOCALIZACAO_APARENCIA_NA_IMAGEM,
    ORDEM_RENDERIZACAO_APARENCIA,
    TAMANHO_APARENCIA_ABELHA
} from "../../app/core/constants/aparencia";
import { AbelhaCamadaComponent } from "./abelha-camada.component";

/**
 * Renderiza uma abelha em um TamanhoAbelha específico: a base (tamanhos.gif) por baixo,
 * empilhada com as aparências recebidas. Cada camada é desenhada por `bee-abelha-camada`
 * a partir de um relógio compartilhado, pra que a animação de todas fique em sincronia.
 */
@Component({
    selector: 'bee-abelha',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="relative" [style.width.px]="tamanhoContainer()" [style.height.px]="tamanhoContainer()">
        <bee-abelha-camada [url]="caminhoImagemBase" [offsetX]="offsetX()" [scale]="scale()" />
        @for (aparencia of camadas(); track aparencia.id) {
            <bee-abelha-camada [url]="aparencia.urlImagem" [offsetX]="offsetX()" [scale]="scale()" />
        }
    </div>
    `,
    imports: [AbelhaCamadaComponent]
})
export class AbelhaComponent {
    protected readonly caminhoImagemBase = CAMINHO_IMAGEM_BASE_ABELHA;

    readonly tamanho = input.required<TamanhoAbelha>();
    readonly aparencias = input<Aparencia[]>([]);
    readonly scale = input<number>(1);

    protected readonly tamanhoContainer = computed(() => TAMANHO_APARENCIA_ABELHA * this.scale());
    protected readonly offsetX = computed(() => LOCALIZACAO_APARENCIA_NA_IMAGEM[this.tamanho()]);

    protected readonly camadas = computed(() => {
        const ordem = ORDEM_RENDERIZACAO_APARENCIA;
        return [...this.aparencias()].sort((a, b) => ordem.indexOf(a.tipo) - ordem.indexOf(b.tipo));
    });
}
