import { Component } from "@angular/core";

@Component({
    selector: 'bee-description',
    template: `<ng-content />`,
    host: { class: 'font-normal text-xs text-neutral-600' }
})
export class DescriptionComponent {}