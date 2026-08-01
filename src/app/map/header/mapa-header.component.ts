import { Component } from "@angular/core";
import { ContinentalTicketsComponent } from "./continental-tickets.component";
import { RegionalTicketsComponent } from "./regional-tickets.component";
import { MoneyCounterComponent } from "./money-counter.component";
import { LocalizacaoAtualComponent } from "./localizacao-atual.component";

@Component({
    selector: 'app-mapa-header',
    template: `
    <app-localizacao-atual class="pl-4!" />
    <div class="flex flex-row justify-center gap-4 items-center">
        <app-continental-tickets />
        <app-regional-tickets />
        <app-money-counter />
    </div>
    <div></div>
    `,
    host: { class: 'absolute top-0 left-0 w-full h-12 z-10 bg-gradient-to-b from-black/50 to-transparent grid grid-cols-[1fr_auto_1fr] items-center' },
    imports: [ContinentalTicketsComponent, RegionalTicketsComponent, MoneyCounterComponent, LocalizacaoAtualComponent]
})
export class MapaHeaderComponent {}