import { Component, inject, input } from "@angular/core";
import { LargeComponent } from "../../../../ui/typography/large.component";
import { BeeDividerComponent } from "../../../../ui/divider/divider.component";
import { TextComponent } from "../../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../../ui/typography/description.component";
import { IconComponent } from "../../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../../ui/button/button.component";
import { ScreenService } from "../../../../services/tela/screen.service";
import { AcaoDoMapa } from "../../../core/models/map/acao-do-mapa";
import { DesafioAtualService } from "../../../core/services/desafio-atual.service";
import { MobileAcaoSelecionadaService } from "../mobile-acao-selecionada.component";

@Component({
    selector: 'app-desafio-action',
    template: `
    <bee-text>{{ acao().titulo }}</bee-text>
    <bee-divider direction="horizontal" />
    <bee-description>
        Teste de descrição do desafio, com um texto maior para testar a quebra de linha e o tamanho do componente.
    </bee-description>
    <bee-divider direction="horizontal" />
    <section class="w-full flex flex-row items-center gap-1">
        <bee-description>
            REWARD
        </bee-description>
        <bee-description class="text-amber-500!">
            (COLLECTED)
        </bee-description>
    </section>
    <div class="w-full flex flex-row items-center justify-between">
        <div class="flex flex-row gap-2 items-center">
            <img src="/icons/dinheiro.png" class="w-6 h-6" />
            <bee-text>150</bee-text>
        </div>
    </div>
    <bee-divider direction="horizontal" />
    <footer class="w-full flex flex-row-reverse">
        @if (acao().desafioId) {
            <bee-button [fluid]="screenService.isMobile()" [size]="screenService.isMobile() ? 'large' : 'small'" (click)="jogar()">
                <bee-icon icon="play" />
                Jogar
            </bee-button>
        } @else {
            <bee-description>Em breve.</bee-description>
        }
    </footer>
    `,
    host: {
        class: 'w-full flex flex-col gap-2'
    },
    imports: [LargeComponent, BeeDividerComponent, DescriptionComponent, IconComponent, TextComponent, ButtonComponent]
})
export class DesafioActionComponent {
    readonly screenService = inject(ScreenService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly mobileAcaoSelecionadaService = inject(MobileAcaoSelecionadaService);

    readonly acao = input.required<AcaoDoMapa>();

    protected jogar() {
        const desafioId = this.acao().desafioId;
        if (!desafioId) return;
        this.desafioAtualService.abrir(desafioId);
        this.mobileAcaoSelecionadaService.isOpen.set(false);
    }
}
