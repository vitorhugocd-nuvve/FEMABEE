import { Component, inject } from "@angular/core";
import { ContinentalTicketsComponent } from "./continental-tickets.component";
import { RegionalTicketsComponent } from "./regional-tickets.component";
import { MoneyCounterComponent } from "./money-counter.component";
import { LocalizacaoAtualComponent } from "./localizacao-atual.component";
import { ScreenService } from "../../../services/tela/screen.service";

@Component({
    selector: 'app-mapa-header',
    template: `
    <app-localizacao-atual class="pl-4!" />
    @if (!screenService.isMobile()) {
        <div class="flex flex-row justify-center gap-4 items-center">
            <app-continental-tickets />
            <app-regional-tickets />
            <app-money-counter />
        </div>
        <div></div>
    }

    <!-- No mobile os indicadores vão pro canto superior direito, empilhados -->
    @if (screenService.isMobile()) {
        <div class="absolute top-2 right-2 flex flex-col items-end gap-1.5">
            <app-continental-tickets />
            <app-regional-tickets />
            <app-money-counter />
        </div>
    }
    `,
    host: { class: 'absolute top-0 left-0 w-full h-12 z-10 bg-gradient-to-b from-black/50 to-transparent grid grid-cols-[1fr_auto_1fr] items-center' },
    imports: [ContinentalTicketsComponent, RegionalTicketsComponent, MoneyCounterComponent, LocalizacaoAtualComponent]
})
export class MapaHeaderComponent {
    protected readonly screenService = inject(ScreenService);
}