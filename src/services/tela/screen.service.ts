import {
    computed,
    DestroyRef,
    Injectable,
    inject,
    signal,
} from '@angular/core';

import { SCREEN_BREAKPOINTS } from './screen-breakpoints.token';

@Injectable({
    providedIn: 'root',
})
export class ScreenService {
    private readonly destroyRef = inject(DestroyRef);
    private readonly breakpoints = inject(SCREEN_BREAKPOINTS);

    private readonly _screen = signal(this.resolveViewport());

    readonly screen = this._screen.asReadonly();
    readonly isMobile = computed(() => this._screen() === 'MOBILE');
    readonly isTablet = computed(() => this._screen() === 'TABLET');
    readonly isDesktop = computed(() => this._screen() === 'DESKTOP');

    constructor() {
        if (typeof window === 'undefined') {
            return;
        }

        const updateScreen = () => {
            this._screen.set(this.resolve(window.innerWidth));
        };

        updateScreen();
        window.addEventListener('resize', updateScreen);
        window.addEventListener('orientationchange', updateScreen);

        this.destroyRef.onDestroy(() => {
            window.removeEventListener('resize', updateScreen);
            window.removeEventListener('orientationchange', updateScreen);
        });
    }

    get current(): string {
        return this._screen();
    }

    private resolveViewport(): string {
        if (typeof window === 'undefined') {
            return 'DESKTOP';
        }

        return this.resolve(window.innerWidth);
    }

    private resolve(width: number): string {
        return this.breakpoints.find(
            breakpoint => width <= breakpoint.maxWidth,
        )?.name ?? 'DESKTOP';
    }
}