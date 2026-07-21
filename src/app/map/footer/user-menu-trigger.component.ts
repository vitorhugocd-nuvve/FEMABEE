import { Component, inject } from "@angular/core";
import { BeeCardComponent } from "../../../ui/card/card.component";
import { ScreenService } from "../../../services/tela/screen.service";
import { TextComponent } from "../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";

@Component({
    selector: 'app-user-menu-trigger',
    template: `
    <bee-card class="w-fit p-0.5! flex flex-row gap-2">
        <div class="flex flex-col justify-center pl-4! max-w-full min-w-0!">
            <bee-text class="truncate">Lívia Delantonia</bee-text>
            <bee-description class="truncate">@delantonialivia</bee-description>
        </div>
        <div class="h-12 w-12 bg-amber-400 inside-border">
            <img src="/icons/beevia.png" alt="Beevia" class="h-full! w-full! object-cover tile-icon" />
        </div>
    </bee-card>
    `,
    imports: [BeeCardComponent, TextComponent, DescriptionComponent]
})
export class UserMenuTriggerComponent {
    readonly screenService = inject(ScreenService);
}