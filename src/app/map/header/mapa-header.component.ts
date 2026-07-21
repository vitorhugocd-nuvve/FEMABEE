import { Component } from "@angular/core";
import { ContinentalTicketsComponent } from "./continental-tickets.component";
import { RegionalTicketsComponent } from "./regional-tickets.component";
import { MoneyCounterComponent } from "./money-counter.component";

@Component({
    selector: 'app-mapa-header',
    template: `
    <app-continental-tickets />
    <app-regional-tickets />
    <app-money-counter />
    `,
    host: { class: 'absolute top-0 left-0 w-full h-12 z-10 bg-gradient-to-b from-black/50 to-transparent flex flex-row justify-center gap-4 items-center' },
    imports: [ContinentalTicketsComponent, RegionalTicketsComponent, MoneyCounterComponent]
})
export class MapaHeaderComponent {}