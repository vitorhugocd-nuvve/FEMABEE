import { Component } from "@angular/core";

@Component({
    selector: 'bee-field',
    template: `
    <ng-content />
    `,
    host: {
        class: 'flex flex-col gap-0.5 w-full'
    }
})
export class FieldComponent {}