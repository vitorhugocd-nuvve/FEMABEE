import { Component, computed, inject, model } from "@angular/core";
import { DialogComponent } from "../../../ui/dialog/dialog.component";
import { AbelhaComponent } from "../../../ui/abelha/abelha.component";
import { LargeComponent } from "../../../ui/typography/large.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { BeeDividerComponent } from "../../../ui/divider/divider.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { BeeCardComponent, BeeCardContentComponent } from "../../../ui/card/card.component";
import { AparenciaEquipadaService } from "../../core/progresso/aparencia-equipada.service";
import { AparenciaObtidaService } from "../../core/progresso/aparencia-obtida.service";
import { NiveisConcluidosAbelhaService } from "../../core/progresso/niveis-concluidos-abelha.service";
import { SequenciaSemErrarService } from "../../core/progresso/sequencia-sem-errar.service";
import { AbelhaProgressoService } from "../../core/progresso/abelha-progresso.service";
import { AbelhaEconomiaService } from "../../core/jogador/abelha-economia.service";
import { ConquistaService } from "../../core/services/conquista.service";
import { AuthService } from "../../core/auth/auth.service";
import { AbelhaSelecionadaService } from "../../core/jogador/abelha-selecionada.service";

@Component({
    selector: 'app-perfil',
    template: `
    <bee-dialog [(open)]="open" title="Perfil">
        <div class="flex flex-col items-center gap-2 p-4">
            <div class="h-20 w-20 bg-amber-400 inside-border flex items-center justify-center">
                <bee-abelha [tamanho]="tamanhoEquipado()" [aparencias]="aparenciasEquipadas()" [scale]="2.2" />
            </div>
            <div class="flex flex-col items-center">
                <bee-large>{{ nome() }}</bee-large>
                <bee-description>{{ nick() }}</bee-description>
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
    private readonly aparenciaObtidaService = inject(AparenciaObtidaService);
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);
    private readonly sequenciaSemErrarService = inject(SequenciaSemErrarService);
    private readonly abelhaProgressoService = inject(AbelhaProgressoService);
    private readonly abelhaEconomiaService = inject(AbelhaEconomiaService);
    private readonly conquistaService = inject(ConquistaService);
    private readonly authService = inject(AuthService);
    private readonly abelhaSelecionadaService = inject(AbelhaSelecionadaService);

    readonly open = model.required<boolean>();

    protected readonly aparenciasEquipadas = this.aparenciaEquipadaService.equipadas;
    protected readonly tamanhoEquipado = this.aparenciaEquipadaService.tamanho;
    protected readonly nome = computed(() => this.abelhaSelecionadaService.abelha()?.nome ?? '');
    protected readonly nick = computed(() => {
        const nomeDeUsuario = this.authService.usuarioLogado()?.nomeDeUsuario;
        return nomeDeUsuario ? `@${nomeDeUsuario}` : '';
    });

    protected readonly conquistasObtidas = computed(() =>
        this.conquistaService.comEstado().filter(c => c.desbloqueada).length
    );

    protected readonly cards = computed(() => [
        { icon: 'trophy', label: 'Fases Vencidas', valor: this.niveisConcluidosAbelhaService.quantidadeConcluida() },
        { icon: 'shirt', label: 'Roupas Obtidas', valor: this.aparenciaObtidaService.quantidadeObtida() },
        { icon: 'plane', label: 'Passagens de Avião', valor: this.abelhaEconomiaService.ticketContinental() },
        { icon: 'bus', label: 'Passagens de Ônibus', valor: this.abelhaEconomiaService.ticketRegional() },
        { icon: 'wallet', label: 'Dinheiro Atual', valor: this.abelhaEconomiaService.dinheiro() },
        { icon: 'zap', label: 'Sequência sem Errar', valor: this.sequenciaSemErrarService.sequenciaAtual() },
        { icon: 'repeat', label: 'Total de Tentativas', valor: this.abelhaProgressoService.totalTentativas() },
        { icon: 'star', label: 'Conquistas Obtidas', valor: this.conquistasObtidas() },
    ]);
}
