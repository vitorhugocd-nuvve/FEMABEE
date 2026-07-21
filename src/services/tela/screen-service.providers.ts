import { Provider } from "@angular/core";
import { SCREEN_BREAKPOINTS } from "./screen-breakpoints.token";

export const ScreenProviders: Provider[] = [
    {
        provide: SCREEN_BREAKPOINTS,
        useValue: [
            {
                name: 'MOBILE',
                maxWidth: 600,
            },
            {
                name: 'DESKTOP',
                maxWidth: Number.MAX_SAFE_INTEGER,
            },
        ],
    },
];