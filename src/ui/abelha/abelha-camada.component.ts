import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, OnInit, computed, effect, inject, input, viewChild } from "@angular/core";
import { TAMANHO_APARENCIA_ABELHA } from "../../app/core/constants/aparencia";
import { GifDecodificado, carregarGif, quadroNoInstante } from "./gif-decoder";
import { iniciarRelogioAbelha, relogioAbelha } from "./abelha-relogio";

/**
 * Uma única camada (base da abelha ou uma aparência) desenhada em canvas, quadro a quadro,
 * a partir do relógio compartilhado — em vez de deixar o navegador tocar o GIF nativamente
 * (o que dessincroniza camadas que carregam em momentos diferentes).
 */
@Component({
    selector: 'bee-abelha-camada',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <canvas
        #tela
        [width]="TAMANHO_APARENCIA_ABELHA"
        [height]="TAMANHO_APARENCIA_ABELHA"
        class="absolute inset-0"
        [style.width.px]="tamanhoExibido()"
        [style.height.px]="tamanhoExibido()"
        style="image-rendering: pixelated;"
    ></canvas>
    `
})
export class AbelhaCamadaComponent implements OnInit {
    protected readonly TAMANHO_APARENCIA_ABELHA = TAMANHO_APARENCIA_ABELHA;

    readonly url = input.required<string>();
    readonly offsetX = input.required<number>();
    readonly scale = input<number>(1);

    protected readonly tamanhoExibido = computed(() => TAMANHO_APARENCIA_ABELHA * this.scale());

    private readonly tela = viewChild<ElementRef<HTMLCanvasElement>>('tela');
    private readonly injector = inject(Injector);
    private readonly destroyRef = inject(DestroyRef);
    private gif: GifDecodificado | null = null;

    ngOnInit(): void {
        let destruido = false;
        this.destroyRef.onDestroy(() => { destruido = true; });

        carregarGif(this.url()).then(gif => {
            if (destruido) return;
            this.gif = gif;
            this.desenhar();
        });

        const pararRelogio = iniciarRelogioAbelha();
        this.destroyRef.onDestroy(pararRelogio);

        effect(() => {
            relogioAbelha();
            this.desenhar();
        }, { injector: this.injector });
    }

    private desenhar() {
        const gif = this.gif;
        const canvas = this.tela()?.nativeElement;
        if (!gif || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const quadro = quadroNoInstante(gif, relogioAbelha());
        ctx.clearRect(0, 0, TAMANHO_APARENCIA_ABELHA, TAMANHO_APARENCIA_ABELHA);
        ctx.putImageData(quadro.imageData, -this.offsetX(), 0);
    }
}
