# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"FEMABEE" (Angular package name `client`) is a bee-themed, gamified educational map app. All domain naming (models, services, templates, copy) is in **Portuguese** — keep new code consistent with that (e.g. `Desafio`, `Mapa`, `Pergunta`, `solicitando`, `dificuldade`). UI copy strings are Portuguese too. The overhaul style of the app, is `Old-School`, `Pixel Art`, `Retro-UI`, `Windows 95 Style`

## Commands

Package manager is **pnpm** (`packageManager: pnpm@10.30.3` in package.json) — use `pnpm`, not `npm`/`yarn`.

- `pnpm start` / `ng serve` — dev server at http://localhost:4200
- `pnpm build` / `ng build` — production build to `dist/`
- `ng build --configuration development` — dev build (unminified, sourcemaps)
- `pnpm test` / `ng test` — runs the Angular/Vitest unit-test builder (`@angular/build:unit-test`)
- `ng generate component path/to/name` — scaffold a new component (project prefix is `app`, but most UI-library components hand-declare a `bee-` selector instead of the CLI default — see below)

There are currently **no test files** in the repo (no `*.spec.ts`) despite Vitest/jsdom being wired up via `tsconfig.spec.json` — don't assume existing test coverage or patterns to mimic; you'll be establishing the first ones.

There is no e2e framework configured.

## Architecture

Standalone-components Angular 21 app (no NgModules). Root `App` (src/app/app.ts) renders only `<app-map />` directly — routing (`app.routes.ts`) currently only defines a lazy `/login` route that isn't wired into any router-outlet in the shell, so it's effectively dead/in-progress; don't assume the router is the primary navigation mechanism yet.

### Layered structure

- **`src/ui/`** — a self-contained, app-agnostic component/directive library (design system), analogous to shadcn/spartan-ng "hlm" primitives. Everything here uses the `bee-` selector prefix and is imported by **relative path** from feature code (e.g. `../../ui/button/button.component`), *not* via the `@ui/*` path alias.
  - The `@ui/*` TS path aliases in `tsconfig.json` (`@ui/accordion`, `@ui/drawer`, `@ui/utils`) are only used *inside* the spartan-ng-derived accordion/utils libs themselves (`src/ui/accordion`, `src/ui/utils`). Note `@ui/drawer` points at `src/ui/drawer/src/index.ts`, which does not exist — the actual component lives at `src/ui/bottom-drawer/`; don't rely on that alias.
  - Many "components" here are actually `@Directive`s with a dual selector like `'[bee-button],bee-button'` (see `button.component.ts`, `checkbox.component.ts`, `input.component.ts`, `label.component.ts`) so they can be applied as an attribute on a native element (`<button bee-button>`) or used standalone. Follow this pattern for new form/interactive primitives rather than wrapping natives in a new host element.
  - Styling is Tailwind v4 utility classes baked into each component's `host: { class: '...' }` (no external `.scss`/`.css` per component). Shared one-off utility classes (`.shadow-border`, `.pattern-background`, `.tile-icon`, etc.) live in `src/styles.css`. `src/bain-styles.css` currently exists but is empty.
  - `bee-icon` (`src/ui/icon/icon.component.ts`) fetches SVGs from the `pixelarticons` CDN by name at runtime (not `@ng-icons` despite that package being a dependency) — pass the pixelarticons icon slug as `icon` input.

- **`src/app/core/`** — domain layer, framework-agnostic-ish:
  - `core/models/` — domain model classes/interfaces (e.g. `Mapa`, `Desafio`, `Quiz`, `QuizGame`). The common pattern is a `*Props` type plus a class wrapping `private props: XProps` with getters, and behavior methods on the class (e.g. `Mapa.getMapActionDataList()`, `QuizGame.validar()`). Prefer this shape over anemic plain interfaces when adding domain logic.
  - `core/seeds/` — hardcoded mock/seed data (`seeds/data/**/*.seed.ts`) plus "repository" services (`seeds/repositories/*-repository.service.ts`, `providedIn: 'root'`) that look up seed data by id. These stand in for a future real backend/API — when wiring up HTTP, replace the repository internals rather than changing call sites.
  - `core/constants/` — shared constants like `TAMANHO_TILE` (tile size in px, currently 16), used by both the map model and the `bee-map` viewer to compute tile grids.

- **`src/app/challenges/`** — one subfolder per challenge/game type (`quiz/`, `complete-texto/`), each with a `*.component.ts`, a state service extending `DesafioBaseService` (`challenges/desafio-base.service.ts` — abstract base exposing `solicitando`/`progresso` signals and a `simularValidacao()` helper that fakes network latency), and a `buscar-*.service.ts` "fetch" service that currently returns seed/mock data via a signal. When real APIs land, `simularValidacao` and the `buscar-*` services are the intended seams to swap to `HttpClient`.

- **`src/app/map/`** — the main screen: `map.component.ts` hosts the `bee-map` viewer (from `src/ui/map`), header/footer chrome (`header/`, `footer/`), and action markers (`actions/`) that open challenges when tapped. `MapaAtualService` (map/services) holds the currently-loaded `Mapa` as a signal and requests it (currently also mock/delayed) from `MapaRepositoryService`.

- **`src/ui/map/`** — the generic pan/zoom tile-map primitive (`BeeMapComponent`/`bee-map`), decoupled from any bee-app domain concepts except importing `TAMANHO_TILE`. Zoom/pan/drag state is split across three instance-scoped services (`MapCameraService`, `MapTileService`, `MapInteractionService`), each provided fresh per `<bee-map>` instance — mirror this separation-of-concerns if extending map behavior rather than piling more state into the component itself.

- **`src/services/tela/`** — standalone (non-`app/`) breakpoint/screen-size service (`ScreenService`, `isMobile`/`isTablet`/`isDesktop` computed signals), configured via an injectable `SCREEN_BREAKPOINTS` token and registered through `ScreenProviders` in `app.config.ts`.

### State management conventions

- Signals everywhere for state; `computed()` for derived state; no NgRx/other state libs.
- Services expose private `_signal` + public `readonly signal = this._signal.asReadonly()` pairs — follow this when adding new state to a service rather than exposing a raw mutable signal.
- Async "requests" throughout the codebase (`MapaAtualService.request()`, `DesafioBaseService.simularValidacao()`, `buscar-*.service.ts`) are currently simulated with `setTimeout`/`Promise` delays over seed data — this is a deliberate placeholder for a not-yet-built backend, not dead code to clean up.

## Coding conventions (from `.github/copilot-instructions.md`)

These Copilot-authored rules apply equally here:

- Standalone components only; do **not** set `standalone: true` explicitly (implicit default in v20+).
- Signals for state, `computed()` for derived state; never call `.mutate()` on a signal — use `.update()`/`.set()`.
- `input()`/`output()` functions, not `@Input()`/`@Output()` decorators.
- No `@HostBinding`/`@HostListener` — use the `host: {}` object in the decorator instead.
- `ChangeDetectionStrategy.OnPush` on components.
- Native control flow (`@if`/`@for`/`@switch`), not `*ngIf`/`*ngFor`/`*ngSwitch`. (Note: some existing map/library code still imports `NgClass`/`NgStyle` for dynamic class/style objects — that's compatible with, not a replacement for, native control flow.)
- `class`/`style` bindings, not `ngClass`/`ngStyle`, in new code.
- `NgOptimizedImage` for static images (not yet used anywhere in the repo — apply going forward).
- Reactive forms over template-driven forms.
- `inject()` function over constructor injection; services `providedIn: 'root'` unless intentionally instance-scoped via a component's `providers: []` (as done for `MapaAtualService`, `MapCameraService`, etc.).
- Must pass AXE / WCAG AA (focus management, contrast, ARIA).

## Formatting

Prettier config (`.prettierrc`): 100-char print width, single quotes, `angular` parser for `*.html`. `.editorconfig`: 2-space indent, single quotes for `.ts`. No lint script is currently defined in `package.json`.
