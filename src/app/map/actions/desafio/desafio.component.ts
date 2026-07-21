import { Component, inject } from "@angular/core";
import { LargeComponent } from "../../../../ui/typography/large.component";
import { BeeDividerComponent } from "../../../../ui/divider/divider.component";
import { TextComponent } from "../../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../../ui/typography/description.component";
import { IconComponent } from "../../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../../ui/button/button.component";
import { ScreenService } from "../../../../services/tela/screen.service";

@Component({
    selector: 'app-desafio-action',
    template: `
    <bee-text> FACTORY-ERROR 1 </bee-text>
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
        <bee-button [fluid]="screenService.isMobile()" [size]="screenService.isMobile() ? 'large' : 'small'">
            <bee-icon icon="play" />
            Play Again
        </bee-button>
    </footer>
    `,
    host: {
        class: 'w-full flex flex-col gap-2'
    },
    imports: [LargeComponent, BeeDividerComponent, DescriptionComponent, IconComponent, TextComponent, ButtonComponent]
})
export class DesafioActionComponent {
    readonly screenService = inject(ScreenService);
}