import { Component, computed, inject, signal } from "@angular/core";
import { BeeCardComponent } from "../../../ui/card/card.component";
import { ScreenService } from "../../../services/tela/screen.service";
import { TextComponent } from "../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { AbelhaComponent } from "../../../ui/abelha/abelha.component";
import { MenuJogadorComponent } from "./menu-jogador.component";
import { AparenciaEquipadaService } from "../../core/progresso/aparencia-equipada.service";
import { AuthService } from "../../core/auth/auth.service";
import { AbelhaSelecionadaService } from "../../core/jogador/abelha-selecionada.service";

@Component({
    selector: 'app-user-menu-trigger',
    template: `
    <bee-card
        class="w-fit p-0.5! flex flex-row gap-2 cursor-pointer hover:-translate-y-0.5 transition-all duration-150 active:translate-y-0"
        (click)="menuAberto.set(true)">
        <div class="flex flex-col justify-center pl-4! max-w-full min-w-0!">
            <bee-text class="truncate">{{ nome() }}</bee-text>
            <bee-description class="truncate">{{ nick() }}</bee-description>
        </div>
        <div class="h-12 w-12 bg-amber-400 inside-border flex items-center justify-center">
            <bee-abelha [tamanho]="tamanhoEquipado()" [aparencias]="aparenciasEquipadas()" [scale]="1.5" />
        </div>
    </bee-card>

    <app-menu-jogador [(open)]="menuAberto" />
    `,
    imports: [BeeCardComponent, TextComponent, DescriptionComponent, AbelhaComponent, MenuJogadorComponent]
})
export class UserMenuTriggerComponent {
    readonly screenService = inject(ScreenService);
    private readonly aparenciaEquipadaService = inject(AparenciaEquipadaService);
    private readonly authService = inject(AuthService);
    private readonly abelhaSelecionadaService = inject(AbelhaSelecionadaService);

    protected readonly aparenciasEquipadas = this.aparenciaEquipadaService.equipadas;
    protected readonly tamanhoEquipado = this.aparenciaEquipadaService.tamanho;
    protected readonly nome = computed(() => this.abelhaSelecionadaService.abelha()?.nome ?? '');
    protected readonly nick = computed(() => {
        const nomeDeUsuario = this.authService.usuarioLogado()?.nomeDeUsuario;
        return nomeDeUsuario ? `@${nomeDeUsuario}` : '';
    });
    protected readonly menuAberto = signal(false);
}
