import { Component } from "@angular/core";

@Component({
    selector: 'bee-large',
    template: `<ng-content />`,
    host: { class: 'text-lg text-neutral-900' }
})
export class LargeComponent {}