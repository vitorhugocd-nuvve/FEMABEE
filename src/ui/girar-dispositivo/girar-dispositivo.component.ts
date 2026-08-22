import { Component, inject } from "@angular/core";
import { IconComponent } from "../icon/icon.component";
import { LargeComponent } from "../typography/large.component";
import { DescriptionComponent } from "../typography/description.component";
import { ScreenService } from "../../services/tela/screen.service";

/**
 * Overlay bloqueante pedindo pra girar o aparelho — só aparece em telas pequenas/médias
 * (celular/tablet) E quando o navegador está em orientação retrato (`portrait:flex`, variant
 * nativo do Tailwind pra `@media (orientation: portrait)`). Desktop com janela estreita não
 * conta como "aparelho": o gate de `isMobile()/isTablet()` evita o overlay aparecer ali.
 * Usado nos desafios que precisam de mais largura (Encontre o Bug, Complete o Código).
 */
@Component({
    selector: 'bee-girar-dispositivo',
    template: `
    @if (screenService.isMobile() || screenService.isTablet()) {
        <div class="hidden portrait:flex fixed inset-0 z-[999] pattern-background flex-col items-center justify-center gap-3 p-6 text-center">
            <bee-icon icon="reload" [width]="48" class="animate-spin" />
            <bee-large>Gire seu aparelho</bee-large>
            <bee-description>Esse desafio fica melhor na horizontal — vire a tela do seu celular pra continuar.</bee-description>
        </div>
    }
    `,
    host: { class: 'contents' },
    imports: [IconComponent, LargeComponent, DescriptionComponent]
})
export class GirarDispositivoComponent {
    protected readonly screenService = inject(ScreenService);
}
