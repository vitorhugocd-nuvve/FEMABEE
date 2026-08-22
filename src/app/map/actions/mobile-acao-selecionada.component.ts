import { Component, inject, Injectable, signal } from "@angular/core";
import { BottomDrawerComponent } from "../../../ui/bottom-drawer/bottom-drawer.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { LargeComponent } from "../../../ui/typography/large.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { DesafioActionComponent } from "./desafio/desafio.component";
import { AcaoDoMapa } from "../../core/models/map/acao-do-mapa";
import { TipoAcao } from "../../core/models/map/tipo-acao";
import { LojaActionComponent } from "./loja/loja.component";
import { ViagemActionComponent } from "./viagem/viagem-action.component";

@Injectable()
export class MobileAcaoSelecionadaService {
    readonly isOpen = signal(false);
    readonly acaoSelecionada = signal<AcaoDoMapa | null>(null);
    /** Ativado ao tocar numa viagem cujo padrão ainda não está liberado nesta fase do jogo. */
    readonly bloqueado = signal(false);

    public selecionar(acao: AcaoDoMapa) {
        this.bloqueado.set(false);
        this.acaoSelecionada.set(acao);
        this.isOpen.set(true);
    }

    public selecionarBloqueado() {
        this.acaoSelecionada.set(null);
        this.bloqueado.set(true);
        this.isOpen.set(true);
    }
}

@Component({
    selector: 'app-mobile-acao-selecionada',
    template: `
    <bee-bottom-drawer [(open)]="isOpen">
        @if (bloqueado()) {
            <div class="w-full flex flex-col items-center gap-2 py-2 text-center">
                <bee-icon icon="stop" [width]="32" />
                <bee-large>Espera aí chefe!</bee-large>
                <bee-description>Essa fase ainda está bloqueada. Conclua as fases anteriores primeiro.</bee-description>
            </div>
        } @else if (acaoSelecionada(); as acao) {
            @switch (acao.tipo) {
                @case (tipoAcao.Loja) {
                    <app-loja-action [lojaId]="acao.lojaId!" />
                }
                @case (tipoAcao.Onibus) {
                    <app-viagem-action [acao]="acao" />
                }
                @case (tipoAcao.Aviao) {
                    <app-viagem-action [acao]="acao" />
                }
                @default {
                    <app-desafio-action [acao]="acao" />
                }
            }
        }
    </bee-bottom-drawer>
    `,
    imports: [BottomDrawerComponent, DesafioActionComponent, LojaActionComponent, ViagemActionComponent, IconComponent, LargeComponent, DescriptionComponent]
})
export class MobileAcaoSelecionadaComponent {
    private readonly mobileAcaoSelecionadaService = inject(MobileAcaoSelecionadaService);

    protected readonly tipoAcao = TipoAcao;

    readonly isOpen = this.mobileAcaoSelecionadaService.isOpen;
    readonly acaoSelecionada = this.mobileAcaoSelecionadaService.acaoSelecionada;
    readonly bloqueado = this.mobileAcaoSelecionadaService.bloqueado;
}