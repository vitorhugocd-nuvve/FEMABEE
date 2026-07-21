import { Directive, Input, booleanAttribute, inject, signal, ElementRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Directive({
    selector: '[bee-checkbox]',
    host: {
        type: 'checkbox',
        class: `
            appearance-none relative w-5! h-5!
            border-2 bg-white cursor-pointer transition-all duration-200
            checked:bg-amber-500
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-amber-400 focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:border-neutral-400
            after:content-[''] after:absolute after:inset-0 after:hidden
            checked:after:block after:bg-white
            after:[mask-image:url('https://unpkg.com/pixelarticons@latest/svg/check.svg')]
            after:[mask-size:contain] after:[mask-repeat:no-repeat] after:[mask-position:center]
        `,
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: CheckboxDirective,
        multi: true
    }]
})
export class CheckboxDirective implements ControlValueAccessor {

    @Input({ transform: booleanAttribute }) single = false;
    @Input() value: unknown = true;

    private _el = inject(ElementRef<HTMLInputElement>);
    private _onChange = (_: unknown) => {};
    private _onTouched = () => {};

    @HostListener('change', ['$event'])
    onNativeChange(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        const next = this.single ? (checked ? this.value : null) : checked;
        this._onChange(next);
        this._onTouched();
    }

    writeValue(value: unknown): void {
        this._el.nativeElement.checked = this.single
            ? value === this.value
            : !!value;
    }

    registerOnChange(fn: (_: unknown) => void) { this._onChange = fn; }
    registerOnTouched(fn: () => void) { this._onTouched = fn; }

    setDisabledState(disabled: boolean) {
        this._el.nativeElement.disabled = disabled;
    }
}