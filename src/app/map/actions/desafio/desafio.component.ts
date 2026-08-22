import { Component, computed, inject, input } from "@angular/core";
import { BeeDividerComponent } from "../../../../ui/divider/divider.component";
import { TextComponent } from "../../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../../ui/typography/description.component";
import { IconComponent } from "../../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../../ui/button/button.component";
import { ScreenService } from "../../../../services/tela/screen.service";
import { AcaoDoMapa } from "../../../core/models/map/acao-do-mapa";
import { Recompensa } from "../../../core/models/recompensa/recompensa";
import { TipoRecompensa } from "../../../core/models/recompensa/tipo-recompensa";
import { DesafioAtualService } from "../../../core/services/desafio-atual.service";
import { NiveisConcluidosAbelhaService } from "../../../core/progresso/niveis-concluidos-abelha.service";
import { LojaRepositoryService } from "../../../core/seeds/repositories/loja-repository.service";
import { MobileAcaoSelecionadaService } from "../mobile-acao-selecionada.component";

type ItemRecompensa = { icone: string; label: string };

@Component({
    selector: 'app-desafio-action',
    template: `
    <bee-text>{{ acao().titulo }}</bee-text>
    <bee-divider direction="horizontal" />
    <bee-description>
        Teste de descrição do desafio, com um texto maior para testar a quebra de linha e o tamanho do componente.
    </bee-description>
    <bee-divider direction="horizontal" />
    @if (itensRecompensa().length) {
        <section class="w-full flex flex-col gap-1">
            <div class="flex flex-row items-center gap-1">
                <bee-description>RECOMPENSA</bee-description>
                @if (jaColetada()) {
                    <bee-description class="text-amber-500!">(JÁ COLETADA)</bee-description>
                }
            </div>
            <div class="w-full flex flex-row flex-wrap items-center gap-3">
                @for (item of itensRecompensa(); track item.label) {
                    <div class="flex flex-row gap-1 items-center" [class.opacity-50]="jaColetada()">
                        <img [src]="item.icone" class="w-6 h-6" alt="">
                        <bee-text>{{ item.label }}</bee-text>
                    </div>
                }
            </div>
        </section>
        <bee-divider direction="horizontal" />
    }
    <footer class="w-full flex flex-row-reverse">
        @if (acao().desafioId) {
            <bee-button [fluid]="screenService.isMobile()" [size]="screenService.isMobile() ? 'large' : 'small'" (click)="jogar()">
                <bee-icon icon="play" />
                Jogar
            </bee-button>
        } @else {
            <bee-description>Em breve.</bee-description>
        }
    </footer>
    `,
    host: {
        class: 'w-full flex flex-col gap-2'
    },
    imports: [BeeDividerComponent, DescriptionComponent, IconComponent, TextComponent, ButtonComponent]
})
export class DesafioActionComponent {
    readonly screenService = inject(ScreenService);
    private readonly desafioAtualService = inject(DesafioAtualService);
    private readonly mobileAcaoSelecionadaService = inject(MobileAcaoSelecionadaService);
    private readonly niveisConcluidosAbelhaService = inject(NiveisConcluidosAbelhaService);
    private readonly lojaRepositoryService = inject(LojaRepositoryService);

    readonly acao = input.required<AcaoDoMapa>();

    /** Só é "já coletada" se a fase (esta ação específica) já foi concluída de verdade. */
    protected readonly jaColetada = computed(() => this.niveisConcluidosAbelhaService.estaConcluido(this.acao().id));

    protected readonly itensRecompensa = computed<ItemRecompensa[]>(() =>
        this.acao().recompensas.map(recompensa => this.descreverRecompensa(recompensa))
    );

    private descreverRecompensa(recompensa: Recompensa): ItemRecompensa {
        switch (recompensa.tipo) {
            case TipoRecompensa.Dinheiro:
                return { icone: '/icons/dinheiro.png', label: `${recompensa.valor ?? 0}` };
            case TipoRecompensa.PassagemContinental:
                return { icone: '/icons/continental.png', label: 'Passagem de avião' };
            case TipoRecompensa.PassagemRegional:
                return { icone: '/icons/regional.png', label: 'Passagem de ônibus' };
            case TipoRecompensa.Aparencia: {
                const nome = recompensa.aparenciaId !== undefined
                    ? this.lojaRepositoryService.findAparenciaById(recompensa.aparenciaId)?.nome
                    : undefined;
                return { icone: '/icons/camisa.png', label: nome ?? 'Item' };
            }
        }
    }

    protected jogar() {
        const desafioId = this.acao().desafioId;
        if (!desafioId) return;
        this.desafioAtualService.abrir(this.acao().id, desafioId);
        this.mobileAcaoSelecionadaService.isOpen.set(false);
    }
}
