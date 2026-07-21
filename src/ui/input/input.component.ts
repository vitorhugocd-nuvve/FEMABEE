import { computed, Directive, input } from "@angular/core";

@Directive({
    selector: '[bee-input]',
    host: {
        class: 'border-2 w-full rounded-none text-sm bg-white ring-0 focus:border-amber-500 transition-all duration-200 hover:translate-y-[-1px]',
        '[class]': 'computedSize()'
    }
})
export class InputComponent {
    readonly size = input<'small' | 'medium' | 'large'>('medium');
    readonly computedSize = computed(() => {
        switch (this.size()) {
            case 'small':
                return 'p-0.5';
            case 'medium':
                return 'p-1';
            case 'large':
                return 'p-2';
        }
    })
}