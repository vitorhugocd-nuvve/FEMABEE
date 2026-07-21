import { Component, computed, effect, signal, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Indication } from "./indication";
import { SeverityVariants, SeverityVariantKey } from "./indicator.severity";
import { IconComponent } from "../icon/icon.component";
import { TextComponent } from "../typography/text.component";

const ANIMATION_FRAME_MS = 50;

@Component({
    selector: 'bee-indicator',
    standalone: true,
    imports: [CommonModule, IconComponent, TextComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (indication(); as ind) {
            <div [class]="indicatorClasses()">
                <div class="px-2 py-1 text-sm text-white! w-full flex flex-row justify-between gap-2 items-center"
                     [class]="headerClasses()">
                    <div class="flex flex-row gap-2 items-center flex-1">
                        @if (ind.icon) {
                            <bee-icon [icon]="ind.icon" size="1rem"></bee-icon>
                        }
                        <div class="flex flex-col gap-0.5 flex-1">
                            @if (ind.title) {
                                <bee-text class="font-bold text-white!">{{ ind.title }}</bee-text>
                            }
                            <bee-text class="text-white!">{{ ind.message }}</bee-text>
                        </div>
                    </div>
                </div>
                @if (ind.ttlInMs) {
                    <div class="px-2 py-1">
                        <progress 
                            [value]="progressPercentage()" 
                            max="100" 
                            class="w-full!"
                            [class]="progressClasses()">
                        </progress>
                    </div>
                }
            </div>
        }
    `,
    host: {
        '[class]': 'toastClasses()'
    }
})
export class IndicatorComponent {
    readonly indication = signal<Indication | null>(null);
    readonly timeElapsed = signal(0);
    private hideTimeoutId: number | null = null;

    readonly progressPercentage = computed(() => {
        const ind = this.indication();
        if (!ind || !ind.ttlInMs) return 0;
        
        const elapsed = this.timeElapsed();
        const total = ind.ttlInMs;
        return Math.max(0, 100 - (elapsed / total) * 100); // invertido
    });

    readonly severity = computed<SeverityVariantKey>(() => {
        const ind = this.indication();
        return (ind?.severity || 'default') as SeverityVariantKey;
    });

    readonly indicatorClasses = computed(() => {
        const severity = this.severity();
        const variants = SeverityVariants[severity];
        return [
            'shadow-border border-2 p-0.5 flex flex-col gap-1',
            variants.bg,
            variants.border
        ].join(' ');
    });

    readonly headerClasses = computed(() => {
        const severity = this.severity();
        const variants = SeverityVariants[severity];
        return [
            'bg-gradient-to-r w-full flex flex-row justify-between gap-8 items-center',
            variants.header
        ].join(' ');
    });

    readonly progressClasses = computed(() => {
        const severity = this.severity();
        const variants = SeverityVariants[severity];
        return [
            'bg-neutral-400 border-2 pt-1 pb-0.5 inside-border',
            variants.progress
        ].join(' ');
    });

    readonly toastClasses = computed(() => {
        const ind = this.indication();
        if (!ind || !ind.toast) return '';

        const position = ind.toastPosition || 'bottom';
        const positionClass = position === 'top' ? 'top-4' : 'bottom-4';

        return [
            'fixed right-4',
            positionClass,
            'z-50 max-w-sm animate-in slide-in-from-right'
        ].join(' ');
    });

    show(indication: Indication): void {
        this.indication.set(indication);
        this.timeElapsed.set(0);

        if (this.hideTimeoutId !== null) {
            clearTimeout(this.hideTimeoutId);
            this.hideTimeoutId = null;
        }

        if (indication.ttlInMs) {
            this.hideTimeoutId = window.setTimeout(() => {
                this.hide();
            }, indication.ttlInMs);
        }
    }

    hide(): void {
        this.indication.set(null);
        this.timeElapsed.set(0);
        if (this.hideTimeoutId !== null) {
            clearTimeout(this.hideTimeoutId);
            this.hideTimeoutId = null;
        }
    }

    constructor() {
        effect(() => {
            const ind = this.indication();
            if (!ind || !ind.ttlInMs) return;

            const ttl = ind.ttlInMs;
            let animationId: number;
            let lastTime = Date.now();

            const animate = () => {
                const now = Date.now();
                const delta = now - lastTime;
                lastTime = now;

                this.timeElapsed.update(elapsed => {
                    const newElapsed = elapsed + delta;
                    return newElapsed >= ttl ? ttl : newElapsed;
                });

                if (this.timeElapsed() < ttl) {
                    animationId = setTimeout(animate, ANIMATION_FRAME_MS);
                }
            };

            animationId = setTimeout(animate, ANIMATION_FRAME_MS);

            return () => {
                if (animationId) clearTimeout(animationId);
            };
        });
    }
}
