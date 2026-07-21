import {
    Component, Input, OnChanges, OnDestroy, OnInit,
    ElementRef, ViewChild, AfterViewInit,
    model
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'bee-progressbar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <progress [value]="value()" [max]="100" class="w-full!"></progress>
    `,
    host: {class: 'bg-neutral-400 border-2 pt-1 pb-0.5 px-2 inside-border w-full'}
})
export class ProgressbarComponent {
    readonly value = model(0);
}