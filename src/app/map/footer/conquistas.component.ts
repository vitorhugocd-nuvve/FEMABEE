import { Component, inject, model } from "@angular/core";
import { BottomDrawerComponent } from "../../../ui/bottom-drawer/bottom-drawer.component";
import { TextComponent } from "../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ConquistaService } from "../../core/services/conquista.service";

@Component({
    selector: 'app-conquistas',
    template: `
    <bee-bottom-drawer [(open)]="open" title="Conquistas">
        <div class="flex flex-col gap-2">
            @for (item of conquistas(); track item.conquista.id) {
                <div
                    class="shadow-border border-2 p-2 flex flex-row items-center gap-3"
                    [class.opacity-50]="!item.desbloqueada">
                    <div class="h-10 w-10 shrink-0 bg-neutral-300 inside-border flex items-center justify-center">
                        <bee-icon [icon]="item.desbloqueada ? item.conquista.icone : 'lock'" />
                    </div>
                    <div class="flex flex-col min-w-0 flex-1">
                        <bee-text class="font-bold! truncate">{{ item.conquista.titulo }}</bee-text>
                        <bee-description class="truncate">{{ item.conquista.descricao }}</bee-description>
                    </div>
                    @if (item.desbloqueada) {
                        <bee-icon icon="check" class="shrink-0" />
                    }
                </div>
            }
        </div>
    </bee-bottom-drawer>
    `,
    imports: [BottomDrawerComponent, TextComponent, DescriptionComponent, IconComponent]
})
export class ConquistasComponent {
    private readonly conquistaService = inject(ConquistaService);

    readonly open = model.required<boolean>();

    protected readonly conquistas = this.conquistaService.comEstado;
}
