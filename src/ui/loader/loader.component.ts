import { Component, input } from "@angular/core";

@Component({
    selector: 'bee-loader',
    template: `
    <img src="https://unpkg.com/pixelarticons@latest/svg/loader.svg" class="animate-spin" [width]="width() || 16" />
    `,
    host: {class: 'block'}
})
export class LoaderComponent {
    
    readonly width = input<number>();
}