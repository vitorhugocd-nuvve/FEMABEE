import { Component, inject } from "@angular/core";
import { TextComponent } from "../../../ui/typography/text.component";
import { PassagemAviaoService } from "../../core/progresso/passagem-aviao.service";

@Component({
    selector: 'app-continental-tickets',
    template: `
    <img src="/icons/continental.png" class="w-8! h-8! tile-icon" alt="Continental Tickets">
    <bee-text class="text-white! font-black! [-webkit-text-stroke:1px_white]!">{{ passagemAviaoService.quantidade() }}</bee-text>
    `,
    host: { class: 'flex flex-row justify-center gap-2 items-center' },
    imports: [TextComponent]
})
export class ContinentalTicketsComponent {
    protected readonly passagemAviaoService = inject(PassagemAviaoService);
}