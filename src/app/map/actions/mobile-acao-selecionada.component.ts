import { Component, inject, Injectable, signal } from "@angular/core";
import { BottomDrawerComponent } from "../../../ui/bottom-drawer/bottom-drawer.component";
import { DesafioActionComponent } from "./desafio/desafio.component";
import { AcaoDoMapa } from "../../core/models/map/acao-do-mapa";
import { TipoAcao } from "../../core/models/map/tipo-acao";
import { LojaActionComponent } from "./loja/loja.component";
import { ViagemActionComponent } from "./viagem/viagem-action.component";

@Injectable()
export class MobileAcaoSelecionadaService {
    readonly isOpen = signal(false);
    readonly acaoSelecionada = signal<AcaoDoMapa | null>(null);

    public selecionar(acao: AcaoDoMapa) {
        this.acaoSelecionada.set(acao);
        this.isOpen.set(true);
    }
}

@Component({
    selector: 'app-mobile-acao-selecionada',
    template: `
    <bee-bottom-drawer [(open)]="isOpen">
        @if (acaoSelecionada(); as acao) {
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
    imports: [BottomDrawerComponent, DesafioActionComponent, LojaActionComponent, ViagemActionComponent]
})
export class MobileAcaoSelecionadaComponent {
    private readonly mobileAcaoSelecionadaService = inject(MobileAcaoSelecionadaService);

    protected readonly tipoAcao = TipoAcao;

    readonly isOpen = this.mobileAcaoSelecionadaService.isOpen;
    readonly acaoSelecionada = this.mobileAcaoSelecionadaService.acaoSelecionada;
}