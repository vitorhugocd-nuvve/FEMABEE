import { Component } from "@angular/core";

@Component({
    selector: 'bee-title',
    template: `<ng-content />`,
    host: { class: 'font-bold text-xl text-neutral-900' }
})
export class TitleComponent {}