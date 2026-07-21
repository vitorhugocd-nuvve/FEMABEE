// screen-breakpoints.token.ts

import { InjectionToken } from '@angular/core';
import {
    DEFAULT_SCREEN_BREAKPOINTS,
    ScreenBreakpoint,
} from './screen-breakpoints';

export const SCREEN_BREAKPOINTS =
    new InjectionToken<ScreenBreakpoint[]>(
        'SCREEN_BREAKPOINTS',
        {
            factory: () => DEFAULT_SCREEN_BREAKPOINTS,
        },
    );