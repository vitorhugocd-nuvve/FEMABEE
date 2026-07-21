import { Component, computed, inject, input, signal } from "@angular/core";
import { AsyncPipe, NgStyle } from "@angular/common";
import { MapActionData, BeeMapActionComponent } from "../../../ui/map";
import { ZardPopoverDirective, ZardPopoverComponent } from "../../../ui/popover";
import { DesafioActionComponent } from "./desafio/desafio.component";
import { ScreenService } from "../../../services/tela/screen.service";
import { BottomDrawerComponent } from "../../../ui/bottom-drawer/bottom-drawer.component";
import { MobileAcaoSelecionadaService } from "./mobile-acao-selecionada.component";

@Component({
    selector: 'app-acao',
    template: `
    <bee-map-action [x]="acao().x" [y]="acao().y"> 
        <div>
            <div (click)="mobileAcaoSelecionadaService.isOpen.set(true)" class="tile-icon cursor-pointer hover:transition-all hover:-translate-y-0.5 duration-150 active:-translate-y-px" [ngStyle]="tileStyle()"></div>
            <!-- @if (screenService.isMobile()) {
            } @else {
                <div zPopover [zContent]="popoverContent" class="tile-icon cursor-pointer hover:transition-all hover:-translate-y-0.5 duration-150 active:-translate-y-px" [ngStyle]="tileStyle()"></div>
                <ng-template #popoverContent>
                    <z-popover>
                        <app-desafio-action />
                    </z-popover>
                </ng-template>
            } -->
        </div>
    </bee-map-action>
    `,
    imports: [BeeMapActionComponent, NgStyle]
})
export class AcaoComponent {
    readonly mobileAcaoSelecionadaService = inject(MobileAcaoSelecionadaService);
    readonly screenService = inject(ScreenService);
    
    readonly isOpen = signal(false);
    readonly acao = input.required<MapActionData>();

    protected readonly tileStyle = computed(() => {
        const tileIndex = this.acao().tileIndex ?? 0;
        const tileSize = 16;
        const col = tileIndex % 16;
        const row = Math.floor(tileIndex / 16);

        return {
            backgroundImage: "url('/utils/utilitario.gif')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${-col * tileSize}px ${-row * tileSize}px`,
            backgroundSize: 'auto',
        };
    });
}