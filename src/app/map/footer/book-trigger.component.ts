import { Component, signal } from "@angular/core";
import { EnciclopediaComponent } from "./enciclopedia/enciclopedia.component";

@Component({
    selector: 'app-book-trigger',
    template: `
    <img src="/icons/livro.png" class="tile-icon w-10! h-10! cursor-pointer" alt="" (click)="aberto.set(true)">
    <app-enciclopedia [(open)]="aberto" />
    `,
    imports: [EnciclopediaComponent]
})
export class BookTriggerComponent {
    protected readonly aberto = signal(false);
}
