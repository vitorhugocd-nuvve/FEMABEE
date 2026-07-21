// screen-breakpoints.ts

export interface ScreenBreakpoint {
  name: string;
  maxWidth: number;
}

export const DEFAULT_SCREEN_BREAKPOINTS: ScreenBreakpoint[] = [
  {
    name: 'MOBILE',
    maxWidth: 500,
  },
  {
    name: 'TABLET',
    maxWidth: 1024,
  },
  {
    name: 'DESKTOP',
    maxWidth: Number.MAX_SAFE_INTEGER,
  },
];