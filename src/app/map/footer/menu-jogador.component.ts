import { Component, computed, inject, model, signal } from "@angular/core";
import { Router } from "@angular/router";
import { SideDrawerComponent } from "../../../ui/side-drawer/side-drawer.component";
import { AbelhaComponent } from "../../../ui/abelha/abelha.component";
import { LargeComponent } from "../../../ui/typography/large.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { BeeDividerComponent } from "../../../ui/divider/divider.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { ConquistasComponent } from "./conquistas.component";
import { PerfilComponent } from "./perfil.component";
import { AparenciaEquipadaService } from "../../core/progresso/aparencia-equipada.service";
import { AuthService } from "../../core/auth/auth.service";
import { AbelhaSelecionadaService } from "../../core/jogador/abelha-selecionada.service";

const ITENS_MENU_JOGADOR = [
    { icon: 'human', label: 'Perfil', chave: 'perfil' as const },
    { icon: 'star', label: 'Conquistas', chave: 'conquistas' as const },
    { icon: 'repeat', label: 'Trocar de Abelha', chave: 'trocar-abelha' as const },
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
                <bee-large>{{ nome() }}</bee-large>
                <bee-description>{{ nick() }}</bee-description>
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
    <app-perfil [(open)]="perfilAberto" />
    `,
    imports: [
        SideDrawerComponent, AbelhaComponent, LargeComponent, DescriptionComponent,
        BeeDividerComponent, IconComponent, ButtonComponent, ConquistasComponent, PerfilComponent
    ]
})
export class MenuJogadorComponent {
    private readonly aparenciaEquipadaService = inject(AparenciaEquipadaService);
    private readonly authService = inject(AuthService);
    private readonly abelhaSelecionadaService = inject(AbelhaSelecionadaService);
    private readonly router = inject(Router);

    readonly open = model.required<boolean>();

    protected readonly aparenciasEquipadas = this.aparenciaEquipadaService.equipadas;
    protected readonly tamanhoEquipado = this.aparenciaEquipadaService.tamanho;
    protected readonly nome = computed(() => this.abelhaSelecionadaService.abelha()?.nome ?? '');
    protected readonly nick = computed(() => {
        const nomeDeUsuario = this.authService.usuarioLogado()?.nomeDeUsuario;
        return nomeDeUsuario ? `@${nomeDeUsuario}` : '';
    });
    protected readonly itensMenu = ITENS_MENU_JOGADOR;

    protected readonly conquistasAbertas = signal(false);
    protected readonly perfilAberto = signal(false);

    protected selecionarItem(chave: typeof ITENS_MENU_JOGADOR[number]['chave']): void {
        if (chave === 'conquistas') {
            this.open.set(false);
            this.conquistasAbertas.set(true);
        }
        if (chave === 'perfil') {
            this.open.set(false);
            this.perfilAberto.set(true);
        }
        if (chave === 'trocar-abelha') {
            this.open.set(false);
            this.abelhaSelecionadaService.limpar();
            this.router.navigateByUrl('/abelhas');
        }
        if (chave === 'sair') {
            this.open.set(false);
            this.abelhaSelecionadaService.limpar();
            this.authService.logout();
            this.router.navigateByUrl('/login');
        }
    }
}
