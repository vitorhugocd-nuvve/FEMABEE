import { Component, inject } from "@angular/core";
import { TextComponent } from "../../../ui/typography/text.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { SequenciaSemErrarService } from "../../core/progresso/sequencia-sem-errar.service";

/** "Foguinho": contador de fases seguidas concluídas sem errar nenhuma resposta, ao lado do dinheiro. */
@Component({
    selector: 'app-foguinho',
    template: `
    <bee-icon icon="fire" [width]="24" />
    <bee-text class="text-white! font-black! [-webkit-text-stroke:1px_white]!"> {{ sequenciaSemErrarService.sequenciaAtual() }} </bee-text>
    `,
    host: { class: 'flex flex-row justify-center gap-2 items-center' },
    imports: [TextComponent, IconComponent]
})
export class FoguinhoComponent {
    protected readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
}
