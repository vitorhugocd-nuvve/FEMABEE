import { Component, input } from "@angular/core";

@Component({
    selector: 'bee-link',
    template: `
        <a [href]="href()" class="
            relative
            text-sm
            hover:text-amber-700
            text-nowrap
            inline-block
            after:content-['']
            after:absolute
            after:left-0
            after:-bottom-0.5
            after:h-0.5
            after:w-0
            after:bg-current
            after:transition-all
            after:duration-300
            after:ease-in-out
            hover:after:w-full
        ">
            <ng-content />
        </a>
    `
})
export class LinkComponent {
    readonly href = input.required<string>();
}