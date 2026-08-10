import { Component, computed, inject, input, signal } from "@angular/core";
import { TextComponent } from "../../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../../ui/typography/description.component";
import { IconComponent } from "../../../../ui/icon/icon.component";
import { SideDrawerComponent } from "../../../../ui/side-drawer/side-drawer.component";
import { TipoAparencia } from "../../../core/models/aparencia/tipo-aparencia";
import { Aparencia } from "../../../core/models/aparencia/aparencia";
import { estiloIconeAparencia, TITULO_TIPO_APARENCIA } from "../../../core/constants/aparencia";
import { LojaRepositoryService } from "../../../core/seeds/repositories/loja-repository.service";
import { AparenciaObtidaService } from "../../../core/progresso/aparencia-obtida.service";
import { AparenciaEquipadaService } from "../../../core/progresso/aparencia-equipada.service";

/**
 * Seletor de aparência para um `TipoAparencia` específico — um por slot (Corpo, Rosto, Óculos...).
 * A linha mostra o que está equipado agora e abre um drawer com a listagem completa do tipo ao tocar
 * (grade direto na tela ficava impossível de navegar com muitos itens).
 */
@Component({
    selector: 'app-cloth-selector',
    template: `
    <button
        type="button"
        [disabled]="!itens().length"
        (click)="drawerAberto.set(true)"
        class="w-full shadow-border border-2 bg-neutral-300 p-2 flex flex-row items-center gap-3 disabled:opacity-50"
    >
        <div class="h-10 w-10 shrink-0 bg-neutral-200 inside-border flex items-center justify-center">
            @if (equipadaAtual(); as item) {
                <div [style]="estiloIconeAparencia(item)" role="img" [attr.aria-label]="item.nome"></div>
            }
        </div>
        <div class="flex flex-col min-w-0 flex-1 text-left">
            <bee-text class="font-bold! truncate">{{ titulo() }}</bee-text>
            <bee-description class="truncate">
                {{ equipadaAtual()?.nome ?? (itens().length ? 'Nenhum equipado' : 'Nenhum item disponível') }}
            </bee-description>
        </div>
        @if (itens().length) {
            <bee-icon icon="chevron-right" class="shrink-0" />
        }
    </button>

    <bee-side-drawer [(open)]="drawerAberto" [title]="titulo()">
        <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
            @for (item of itens(); track item.id) {
                <button
                    type="button"
                    [disabled]="!possui(item)"
                    (click)="alternar(item)"
                    class="relative shadow-border border-2 bg-neutral-300 p-1.5 flex flex-col items-center gap-1"
                    [class.cursor-pointer]="possui(item)"
                    [class.opacity-40]="!possui(item)"
                    [class.bg-primary!]="equipada(item)"
                >
                    <div [style]="estiloIconeAparencia(item)" role="img" [attr.aria-label]="item.nome"></div>
                    @if (!possui(item)) {
                        <bee-icon icon="lock" class="absolute top-1 right-1 h-3 w-3" />
                    }
                    @if (equipada(item)) {
                        <bee-icon icon="check" class="absolute top-1 right-1 h-3 w-3" />
                    }
                </button>
            }
        </div>
    </bee-side-drawer>
    `,
    host: { class: 'w-full block' },
    imports: [TextComponent, DescriptionComponent, IconComponent, SideDrawerComponent]
})
export class ClothSelectorComponent {
    private readonly lojaRepositoryService = inject(LojaRepositoryService);
    private readonly aparenciaObtidaService = inject(AparenciaObtidaService);
    private readonly aparenciaEquipadaService = inject(AparenciaEquipadaService);

    readonly tipo = input.required<TipoAparencia>();

    protected readonly estiloIconeAparencia = estiloIconeAparencia;
    protected readonly titulo = computed(() => TITULO_TIPO_APARENCIA[this.tipo()]);
    protected readonly itens = computed(() => this.lojaRepositoryService.aparenciasPorTipo(this.tipo()));
    protected readonly equipadaAtual = computed(() => this.aparenciaEquipadaService.equipadaPorTipo(this.tipo()));

    protected readonly drawerAberto = signal(false);

    protected possui(item: Aparencia): boolean {
        return this.aparenciaObtidaService.possui(item.id);
    }

    protected equipada(item: Aparencia): boolean {
        return this.equipadaAtual()?.id === item.id;
    }

    protected alternar(item: Aparencia): void {
        if (!this.possui(item)) return;
        if (this.equipada(item)) {
            this.aparenciaEquipadaService.desequipar(this.tipo());
        } else {
            this.aparenciaEquipadaService.equipar(item);
        }
        this.drawerAberto.set(false);
    }
}
