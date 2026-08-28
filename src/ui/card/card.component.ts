import { Component, computed, input } from "@angular/core";

const CardVariants = {
    down: 'inside-border bg-neutral-400',
    up: 'shadow-border bg-neutral-300'
}

@Component({
    selector: 'bee-card',
    template: `
    <ng-content />
    `,
    host: {
        class: 'duration-300 transition-all shadow-border border-2 p-0.5 bg-neutral-300 flex flex-col gap-1',
        '[class]': 'computedClasses()'
    }
})
export class BeeCardComponent {
    readonly direction = input<'down' | 'up'>('up');

    public computedClasses = computed(() => {
        const direction = CardVariants[this.direction()];
        return [direction, "border-2 p-0.5 flex flex-col gap-1"].join(' ');
    })
}

@Component({
    selector: 'bee-card-content',
    template: `
    <ng-content />
    `,
    host: {
        class: 'p-3.5 flex-auto'
    }
})
export class BeeCardContentComponent { }

@Component({
    selector: 'bee-card-header',
    template: `
    <ng-content />
    `,
    host: {
        class: 'px-2 py-1 text-sm text-white! bg-gradient-to-r from-orange-600 to-amber-400 w-full flex flex-row justify-between gap-8 items-center'
    }
})
export class BeeCardHeaderComponent { }