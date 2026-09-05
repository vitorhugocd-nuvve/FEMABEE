import { booleanAttribute, Component, computed, Directive, inject, input } from "@angular/core";
import { SomService } from "../../services/som/som.service";

@Directive({
    selector: '[bee-button],bee-button',
    host: {
        class: `
            transition-all duration-50
            hover:enabled:translate-y-[-1px]
            active:enabled:bg-neutral-400
            active:enabled:translate-y-[1.5px]
            bg-neutral-300
            focus-visible:bg-neutral-400
            focus-visible:text-neutral-950
            text-neutral-700
            flex flex-row gap-2
            items-center
            shadow-border
            select-none
            border-2 border-black cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:shadow-none
            disabled:translate-y-0
        `,
        '[class.w-full]': 'fluid()',
        '[class]': 'computedSize()',
        '(click)': 'somService.clique()'
    }
})
export class ButtonComponent {
    protected readonly somService = inject(SomService);

    readonly fluid = input(false, {transform: booleanAttribute})

    readonly size = input<'small' | 'medium' | 'large'>('medium');
    readonly computedSize = computed(() => {
        switch (this.size()) {
            case 'small':
                return 'p-1 text-sm';
            case 'medium':
                return 'p-2 text-md';
            case 'large':
                return 'p-4 text-lg';
        }
    })
}