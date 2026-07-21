import { Component } from "@angular/core";

@Component({
    selector: 'bee-text',
    template: `<ng-content />`,
    host: { class: 'font-normal text-sm text-neutral-900' }
})
export class TextComponent {}