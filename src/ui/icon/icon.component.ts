import { booleanAttribute, Component, input } from "@angular/core";
import { LoaderComponent } from "../loader/loader.component";

@Component({
    selector: 'bee-icon',
    template: `
        @if (loading()) {
            <bee-loader [width]="width()" />
        } @else {
            <img src="https://unpkg.com/pixelarticons@latest/svg/{{icon()}}.svg" [width]="width() || 16" />
        }
    `,
    imports: [LoaderComponent]
})
export class IconComponent {
    readonly loading = input(false, {transform: booleanAttribute});
    readonly icon = input.required<string>();
    readonly width = input<number>();
}