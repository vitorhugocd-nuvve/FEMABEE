import { Component } from "@angular/core";
import { ContinentalTicketsComponent } from "../header/continental-tickets.component";
import { MoneyCounterComponent } from "../header/money-counter.component";
import { RegionalTicketsComponent } from "../header/regional-tickets.component";
import { UserMenuTriggerComponent } from "./user-menu-trigger.component";
import { WardrobeTriggerComponent } from "./wardrobe-trigger.component";
import { BookTriggerComponent } from "./book-trigger.component";

@Component({
    selector: 'app-mapa-footer',
    template: `
    <!-- padding na esquerda só pra ficar filé -->
    <div class="pl-4! flex flex-row gap-4 items-center">
        <app-book-trigger />
        <app-wardrobe-trigger />
    </div>
    <app-user-menu-trigger />
    `,
    host: { class: 'absolute bottom-0 left-0 w-full h-fit z-10 bg-gradient-to-t from-black/50 to-transparent flex flex-row justify-between gap-4 items-center' },
    imports: [ContinentalTicketsComponent, RegionalTicketsComponent, MoneyCounterComponent, UserMenuTriggerComponent, WardrobeTriggerComponent, BookTriggerComponent]
})
export class MapaFooterComponent {}