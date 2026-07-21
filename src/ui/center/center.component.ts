import { Component } from "@angular/core";

@Component({
    selector: 'bee-center',
    template: `
    <ng-content />
    `,
    host: { class: 'flex w-full h-full items-center justify-center' }
})
export class CenterComponent {}