import { Component, computed, effect, inject, model, signal } from "@angular/core";
import { DialogComponent } from "../../../../ui/dialog/dialog.component";
import { IconComponent } from "../../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../../ui/button/button.component";
import { LargeComponent } from "../../../../ui/typography/large.component";
import { DescriptionComponent } from "../../../../ui/typography/description.component";
import { LicaoConteudoComponent } from "../../../challenges/licao/licao-conteudo.component";
import { EnciclopediaService } from "../../../core/progresso/enciclopedia.service";
import { Licao } from "../../../core/models/desafios/licao/licao";
import { ScreenService } from "../../../../services/tela/screen.service";

/**
 * O "livrinho" do mapa: uma enciclopédia de padrões de projeto. Cada Lição concluída fica
 * disponível pra reler aqui — a página esquerda é o sumário (por grupo/padrão), a direita é o
 * texto da Lição selecionada. No mobile, só uma página fica visível por vez (o livro real não
 * cabe aberto numa tela estreita).
 */
@Component({
    selector: 'app-enciclopedia',
    template: `
    <bee-dialog [(open)]="open" [bare]="true">
        <div class="relative w-full max-w-4xl mx-auto aspect-[10324/6076] bg-[url('/backgrounds/book.webp')] bg-[length:100%_100%] bg-no-repeat [image-rendering:pixelated]">
            <button
                bee-button
                size="small"
                (click)="open.set(false)"
                class="absolute top-[3%] right-[4%] z-10"
                aria-label="Fechar enciclopédia">
                <bee-icon icon="close" />
            </button>

            <!-- Página esquerda: sumário -->
            <div
                class="absolute top-[10%] bottom-[14%] left-[6%] right-[53%] overflow-y-auto flex flex-col gap-3 pr-[2%]"
                [class.hidden]="screenService.isMobile() && mostrandoConteudo()">
                <bee-large class="text-center!">Enciclopédia</bee-large>

                @if (!sumario().length) {
                    <bee-description class="text-center!">Nenhuma lição cadastrada ainda.</bee-description>
                }

                @for (grupo of sumario(); track grupo.grupo) {
                    <div class="flex flex-col gap-1.5">
                        <span class="text-xs font-bold uppercase tracking-wide opacity-60">{{ grupo.grupo }}</span>

                        @for (porPadrao of grupo.padroes; track porPadrao.padrao) {
                            <div class="flex flex-col gap-0.5 mb-1.5">
                                <span class="text-sm font-semibold">{{ porPadrao.padrao }}</span>

                                @for (entrada of porPadrao.entradas; track entrada.licao.id; let i = $index) {
                                    <button
                                        type="button"
                                        class="flex items-center gap-1.5 text-left text-xs py-0.5"
                                        [class.opacity-40]="!entrada.desbloqueada"
                                        [class.cursor-not-allowed]="!entrada.desbloqueada"
                                        [class.font-bold]="licaoSelecionada()?.id === entrada.licao.id"
                                        [disabled]="!entrada.desbloqueada"
                                        (click)="selecionar(entrada.licao)">
                                        <bee-icon [icon]="entrada.desbloqueada ? 'bookmark' : 'lock'" [width]="11" />
                                        Capítulo {{ i + 1 }}
                                    </button>
                                }
                            </div>
                        }
                    </div>
                }
            </div>

            <!-- Página direita: conteúdo da Lição selecionada -->
            <div
                class="absolute top-[10%] bottom-[14%] left-[53%] right-[6%] overflow-y-auto pl-[2%]"
                [class.hidden]="screenService.isMobile() && !mostrandoConteudo()">
                @if (screenService.isMobile() && licaoSelecionada()) {
                    <button bee-button size="small" (click)="mostrandoConteudo.set(false)" class="mb-2">
                        <bee-icon icon="arrow-left" />
                        Sumário
                    </button>
                }

                @if (licaoSelecionada(); as licao) {
                    <app-licao-conteudo [markdown]="licao.conteudoMarkdown" alturaCodigo="h-40" />
                } @else {
                    <div class="h-full flex items-center justify-center text-center p-2">
                        <bee-description>Escolha uma lição desbloqueada no sumário ao lado.</bee-description>
                    </div>
                }
            </div>
        </div>
    </bee-dialog>
    `,
    imports: [DialogComponent, IconComponent, ButtonComponent, LargeComponent, DescriptionComponent, LicaoConteudoComponent]
})
export class EnciclopediaComponent {
    private readonly enciclopediaService = inject(EnciclopediaService);
    protected readonly screenService = inject(ScreenService);

    readonly open = model.required<boolean>();

    protected readonly sumario = this.enciclopediaService.sumario;
    protected readonly licaoSelecionada = signal<Licao | undefined>(undefined);
    /** Mobile: qual das duas "páginas" está visível — sumário ou o texto da lição escolhida. */
    protected readonly mostrandoConteudo = signal(false);

    constructor() {
        // Sempre reabre no sumário, do zero — evita ficar preso na última lição lida.
        effect(() => {
            if (this.open()) return;
            this.licaoSelecionada.set(undefined);
            this.mostrandoConteudo.set(false);
        });
    }

    protected selecionar(licao: Licao): void {
        this.licaoSelecionada.set(licao);
        this.mostrandoConteudo.set(true);
    }
}
