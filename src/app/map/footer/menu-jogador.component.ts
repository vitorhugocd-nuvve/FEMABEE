import { Component, inject, model, signal } from "@angular/core";
import { SideDrawerComponent } from "../../../ui/side-drawer/side-drawer.component";
import { AbelhaComponent } from "../../../ui/abelha/abelha.component";
import { LargeComponent } from "../../../ui/typography/large.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { BeeDividerComponent } from "../../../ui/divider/divider.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { NICK_USUARIO_MOCK, NOME_USUARIO_MOCK } from "./usuario-mock";
import { ConquistasComponent } from "./conquistas.component";
import { AparenciaEquipadaService } from "../../core/progresso/aparencia-equipada.service";

/** Itens do menu — só "Conquistas" tem ação ligada por enquanto, o resto é só visual. */
const ITENS_MENU_JOGADOR = [
    { icon: 'human', label: 'Perfil', chave: 'perfil' as const },
    { icon: 'sliders', label: 'Configurações', chave: 'configuracoes' as const },
    { icon: 'star', label: 'Conquistas', chave: 'conquistas' as const },
    { icon: 'logout', label: 'Sair', chave: 'sair' as const },
];

@Component({
    selector: 'app-menu-jogador',
    template: `
    <bee-side-drawer [(open)]="open" title="Menu do Jogador">
        <div class="flex flex-col items-center gap-2 pb-4">
            <div class="h-20 w-20 bg-amber-400 inside-border flex items-center justify-center">
                <bee-abelha [tamanho]="tamanhoEquipado()" [aparencias]="aparenciasEquipadas()" [scale]="2.2" />
            </div>
            <div class="flex flex-col items-center">
                <bee-large>{{ nome }}</bee-large>
                <bee-description>{{ nick }}</bee-description>
            </div>
        </div>

        <bee-divider direction="horizontal" />

        <div class="flex flex-col gap-2 pt-4">
            @for (item of itensMenu; track item.label) {
                <button bee-button class="w-full justify-between" (click)="selecionarItem(item.chave)">
                    <span class="flex flex-row items-center gap-2">
                        <bee-icon [icon]="item.icon" />
                        {{ item.label }}
                    </span>
                    <bee-icon icon="chevron-right" />
                </button>
            }
        </div>
    </bee-side-drawer>

    <app-conquistas [(open)]="conquistasAbertas" />
    `,
    imports: [
        SideDrawerComponent, AbelhaComponent, LargeComponent, DescriptionComponent,
        BeeDividerComponent, IconComponent, ButtonComponent, ConquistasComponent
    ]
})
export class MenuJogadorComponent {
    private readonly aparenciaEquipadaService = inject(AparenciaEquipadaService);

    readonly open = model.required<boolean>();

    protected readonly aparenciasEquipadas = this.aparenciaEquipadaService.equipadas;
    protected readonly tamanhoEquipado = this.aparenciaEquipadaService.tamanho;
    protected readonly nome = NOME_USUARIO_MOCK;
    protected readonly nick = NICK_USUARIO_MOCK;
    protected readonly itensMenu = ITENS_MENU_JOGADOR;

    protected readonly conquistasAbertas = signal(false);

    protected selecionarItem(chave: typeof ITENS_MENU_JOGADOR[number]['chave']): void {
        if (chave === 'conquistas') {
            this.open.set(false);
            this.conquistasAbertas.set(true);
        }
        // Perfil / Configurações / Sair: só visual por enquanto.
    }
}
