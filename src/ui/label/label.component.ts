import { Component, Directive } from "@angular/core";

@Directive({
    selector: '[bee-label]',
    host: {
        class: 'text-sm text-neutral-800'
    }
})
export class LabelComponent {}