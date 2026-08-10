import { Component, signal } from "@angular/core";
import { GuardaRoupaComponent } from "./guarda-roupa/guarda-roupa.component";

@Component({
    selector: 'app-wardrobe-trigger',
    template: `
    <img src="/icons/camisa.png" class="tile-icon w-10! h-10! cursor-pointer" alt="" (click)="aberto.set(true)">
    <app-guarda-roupa [(open)]="aberto" />
    `,
    imports: [GuardaRoupaComponent]
})
export class WardrobeTriggerComponent {
    protected readonly aberto = signal(false);
}