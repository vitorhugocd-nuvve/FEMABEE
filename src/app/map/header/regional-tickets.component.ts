import { Component } from "@angular/core";
import { TextComponent } from "../../../ui/typography/text.component";

@Component({
    selector: 'app-regional-tickets',
    template: `
    <img src="/icons/regional.png" class="w-8! h-8! tile-icon" alt="Regional Tickets">
    <bee-text class="text-white! font-black! [-webkit-text-stroke:1px_white]!"> 4 </bee-text>
    `,
    host: { class: 'flex flex-row justify-center gap-2 items-center' },
    imports: [TextComponent]
})
export class RegionalTicketsComponent {}