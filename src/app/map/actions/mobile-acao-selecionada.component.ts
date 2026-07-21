import { Component, inject, Injectable, signal } from "@angular/core";
import { BottomDrawerComponent } from "../../../ui/bottom-drawer/bottom-drawer.component";
import { DesafioActionComponent } from "./desafio/desafio.component";

@Injectable()
export class MobileAcaoSelecionadaService {
    readonly isOpen = signal(false);
}

@Component({
    selector: 'app-mobile-acao-selecionada',
    template: `
    <bee-bottom-drawer [(open)]="isOpen">
        <app-desafio-action />
    </bee-bottom-drawer>
    `,
    imports: [BottomDrawerComponent, DesafioActionComponent]
})
export class MobileAcaoSelecionadaComponent {
    private readonly mobileAcaoSelecionadaService = inject(MobileAcaoSelecionadaService);

    readonly isOpen = this.mobileAcaoSelecionadaService.isOpen;
}