import { Component, inject } from "@angular/core";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { MusicaService } from "../../../services/som/musica.service";

@Component({
    selector: 'app-musica-toggle',
    template: `
    <button
        bee-button
        class="w-10! h-10! p-0! justify-center"
        (click)="musicaService.alternarMudo()"
        [attr.aria-pressed]="musicaService.mudo()"
        [attr.aria-label]="musicaService.mudo() ? 'Ativar música' : 'Silenciar música'">
        <bee-icon [icon]="musicaService.mudo() ? 'volume-x' : 'volume-2'" />
    </button>
    `,
    imports: [IconComponent, ButtonComponent]
})
export class MusicaToggleComponent {
    protected readonly musicaService = inject(MusicaService);
}
