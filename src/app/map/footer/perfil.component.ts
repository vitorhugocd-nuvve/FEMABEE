import { Component, computed, inject, model } from "@angular/core";
import { DialogComponent } from "../../../ui/dialog/dialog.component";
import { AbelhaComponent } from "../../../ui/abelha/abelha.component";
import { LargeComponent } from "../../../ui/typography/large.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { BeeDividerComponent } from "../../../ui/divider/divider.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { BeeCardComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { NICK_USUARIO_MOCK, NOME_USUARIO_MOCK } from "./usuario-mock";
import { AparenciaEquipadaService } from "../../core/progresso/aparencia-equipada.service";
import { UserStatsService } from "../../core/services/user-stats.service";

@Component({
    selector: 'app-perfil',
    template: `
    <bee-dialog [(open)]="open" title="Perfil">
        <div class="flex flex-col items-center gap-2 p-4">
            <div class="h-20 w-20 bg-amber-400 inside-border flex items-center justify-center">
                <bee-abelha [tamanho]="tamanhoEquipado()" [aparencias]="aparenciasEquipadas()" [scale]="2.2" />
            </div>
            <div class="flex flex-col items-center">
                <bee-large>{{ nome }}</bee-large>
                <bee-description>{{ nick }}</bee-description>
            </div>
        </div>

        <bee-divider direction="horizontal" />

        <div class="grid grid-cols-2 gap-2 p-4">
            @for (card of cards(); track card.label) {
                <bee-card class="items-center! text-center! p-2!">
                    <bee-card-content class="flex! flex-col items-center gap-1 p-2!">
                        <bee-icon [icon]="card.icon" [width]="24" />
                        <bee-large>{{ card.valor }}</bee-large>
                        <bee-description class="text-center!">{{ card.label }}</bee-description>
                    </bee-card-content>
                </bee-card>
            }
        </div>
    </bee-dialog>
    `,
    imports: [
        DialogComponent, AbelhaComponent, LargeComponent, DescriptionComponent,
        BeeDividerComponent, IconComponent, BeeCardComponent, BeeCardContentComponent
    ]
})
export class PerfilComponent {
    private readonly aparenciaEquipadaService = inject(AparenciaEquipadaService);
    private readonly userStatsService = inject(UserStatsService);

    readonly open = model.required<boolean>();

    protected readonly aparenciasEquipadas = this.aparenciaEquipadaService.equipadas;
    protected readonly tamanhoEquipado = this.aparenciaEquipadaService.tamanho;
    protected readonly nome = NOME_USUARIO_MOCK;
    protected readonly nick = NICK_USUARIO_MOCK;

    protected readonly cards = computed(() => {
        const stats = this.userStatsService.stats();
        return [
            { icon: 'trophy', label: 'Fases Vencidas', valor: stats.fasesVencidas },
            { icon: 'shirt', label: 'Roupas Obtidas', valor: stats.roupasObtidas },
            { icon: 'plane', label: 'Passes de Avião Gastos', valor: stats.passesAviaoGastos },
            { icon: 'bus', label: 'Passes de Ônibus Gastos', valor: stats.passesOnibusGastos },
            { icon: 'wallet', label: 'Total de Dinheiro Gasto', valor: stats.dinheiroGasto },
            { icon: 'earth', label: 'Mundos Concluídos', valor: stats.mundosConcluidos },
            { icon: 'map', label: 'Continentes Concluídos', valor: stats.continentesConcluidos },
            { icon: 'star', label: 'Conquistas Obtidas', valor: stats.conquistasObtidas },
        ];
    });
}
