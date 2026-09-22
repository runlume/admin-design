<a href="https://runlume.app">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/wordmark-dark.svg" />
  <img src="public/brand/wordmark-light.svg" alt="Runlume" width="220" />
</picture>
</a>

# Admin Frontend

[![License](https://img.shields.io/github/license/runlume/admin-design?style=flat-square&label=license&color=blue)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/runlume/admin-design?style=flat-square&label=version&color=007ec6)](https://github.com/runlume/admin-design/releases)
[![Stack](https://img.shields.io/badge/React%2019%20%C2%B7%20TypeScript%20%C2%B7%20Vite%20%2B%20Tailwind-1f6feb?style=flat-square)](docs/guide/intro.md)
[![Checks](https://img.shields.io/badge/pnpm%20check-passing-2ea44f?style=flat-square)](#verification)

Site: <https://adesign.runlume.app> · Docs: <https://adoc.runlume.app> · Live demo: <https://ago.runlume.app> · [中文](README.md)

The "standard admin" template extracted from the [Runlume](https://runlume.app) platform frontend: semantic tokens, the app shell, shared
components, standard page types and a full component gallery. A product team only has to plug in its own menu,
copy, identity and APIs — the interface language, interaction details and visual rules come from this one copy.

Its backend counterpart is [Standard Admin Backend](https://github.com/runlume/admin-java): wired for the platform
integration SDK with local user management and sign-in, providing the API contract, sessions, permissions, tenant
isolation and platform integration.

React 19 + TypeScript + Vite + Tailwind CSS + Radix UI, with **no chart library, UI framework or component-kit
dependency** (charts and motion are hand-drawn SVG / CSS).

## Quick start

Node.js 24 and pnpm 11.21.0. Only `pnpm-lock.yaml` is maintained — do not mix in npm or yarn.

```bash
pnpm install
pnpm dev            # http://localhost:3200
pnpm build          # output in dist/
pnpm preview        # http://localhost:3201 to preview the build
```

## Use as an npm component library

Base controls, tables, filters, pagination, charts, and page states are built as `@runlume/admin-ui`; the complete template and demo app remain in this
repository. After the package is published, install it with:

```bash
pnpm add @runlume/admin-ui
```

```tsx
import { Button, DataTable, EmptyState } from '@runlume/admin-ui'
import '@runlume/admin-ui/styles.css'
```

The package supports React 18.2–19, ESM, and CommonJS. Fine-grained imports are available from paths such as
`@runlume/admin-ui/components/data-table` and `@runlume/admin-ui/ui/button`. Missing host translations fall back
to readable English instead of exposing i18n keys. Brand assets, example pages, and application state are not
part of the library exports.

## Changelog

Only user-visible changes are listed here; see
[Releases](https://github.com/runlume/admin-design/releases) for the full history.

### 0.2.3 (2026-09-22)

- Accessibility: while a modal overlay (dialog, sheet, dropdown menu, context menu, select) is open, the
  background is marked with both `aria-hidden` and `inert`, fixing the axe `aria-hidden-focus` violation
  and the "background controls are still tabbable" problem. The state is removed on close and never
  applies to the overlay itself.
- New accessibility gate `src/test/e2e/a11y.spec.ts`: full axe scans of the nine gallery pages in light and
  dark mode, plus a scan for each opened overlay, asserting focus returns to the trigger and no `inert`
  leaks into the background.
- Contrast: the `warning` semantic color is darkened to meet AA (`--warning` `#9a6700` → `#946300`;
  contrast against `--warning-soft` 4.44 → 4.74). Out-of-month calendar days, chart bars, and disabled
  transfer rows no longer fall below 4.5:1.
- Component semantics: rating stars are no longer nested buttons (the outer `role="slider"` owns value and
  keyboard handling); transfer lists use `role="group"` instead of `listbox` (a checkbox group by nature);
  the table corner cell is marked presentational; horizontally scrollable containers are focusable.
- Tests: added the `@axe-core/playwright` devDependency (test-only, not shipped).

### 0.2.2 (2026-09-22)

- Refined the warning semantic color and half-star rendering.
- Fixed language initialization being dropped from production builds.

### 0.2.1 (2026-09-22)

- Removed internal maintenance notes from the published package.
- Synced version information across the site and docs.

### 0.2.0 (2026-09-22)

- Added the remaining advanced components and completed npm consumption (exports, types, styles entry).

### 0.1.0 (2026-09-22)

- First public release: standard admin theme and semantic tokens, layout shell, shared components, gallery.

## Verification

```bash
pnpm typecheck                 # tsc -b
pnpm lint                      # oxlint
pnpm test                      # Vitest (unit / component)
pnpm test:e2e                  # Playwright (real browser)
pnpm check                     # the four above + production build
```

Screenshot review (not a regression suite, skipped by default):

```bash
SCREENSHOTS=1 pnpm test:e2e    # screenshots land in /tmp/admin-design-shots
```

When several people or sessions run Playwright in parallel, isolate the output directory with
`pnpm test:e2e -- --output=/tmp/pw-admin-out` to avoid sharing `test-results/` and hitting false failures.

## Documentation site

`docs/` is a standalone VitePress site (`vitepress` is a devDependency only and never ships with the app),
structured as `index.md` + `guide/` (guides) + `components/` (component reference):

```bash
pnpm docs:dev      # http://localhost:3210
pnpm docs:build    # output in docs/.vitepress/dist, dead links fail the build
pnpm docs:preview  # http://localhost:3211 to preview the built docs
```

The docs site reuses brand assets through the `docs/public/brand` symlink pointing at `public/brand`, so
rebranding is a single change.

## Project structure

```text
src/
├── app/            # Shell wiring: routes, layout, providers, example menu
├── components/     # Shared components (shell, page parts, charts, settings panels)
│   └── ui/         # Base controls (button/input/table/tabs/dialog…)
├── hooks/          # Shared hooks
├── lib/            # Pure logic: appearance, i18n, tree, pager, metrics, table prefs…
├── pages/          # Standard page types: dashboard, list, detail, settings, notifications, auth
│   └── design-system/  # Component gallery, split by category (below)
└── test/           # All tests: unit / components / e2e
```

## Component gallery

Everything sits under the "Design system" sidebar group, split by category, and every control is interactive:

| Page                | Path                        | Contents                                                                                                                            |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Overview            | `/design-system`            | Brand, semantic palette, category entry points                                                                                      |
| Basic controls      | `/design-system/basic`      | Button, input, select, checkbox, tag, progress, number field, slider, scroll area, collapsible                                      |
| Forms & pickers     | `/design-system/form`       | Forms, date-time, OTP, password strength, combobox, cascader, multi-select, upload, mention                                         |
| Data display        | `/design-system/data`       | Table (sort, columns, density, pinned, expandable rows, virtual scroll), tree, tree table, descriptions, timeline, layout container |
| Feedback & overlays | `/design-system/feedback`   | Alert, dialog, sheet, confirm, menus, tooltip, multi-step loader, context menu, hover card, states                                  |
| Navigation & flows  | `/design-system/navigation` | Breadcrumb, tabs, steps, shortcuts, page entry points                                                                               |
| Metrics & charts    | `/design-system/metrics`    | Metric cards, line, column, donut, mini bars, bar list, heatmap, radar, funnel, gantt, code block                                   |
| Icons               | `/design-system/icons`      | Full lucide set (lazy loaded), click to copy the component name                                                                     |
| Theme & settings    | `/design-system/theme`      | Palette, notification preferences, accessibility, brand                                                                             |

Component capabilities, props and usage live in the docs site: [components/](docs/components/index.md)
(or run `pnpm docs:dev`).

## Using this as a template

1. **Copy the whole directory** into your product repository and rename `package.json` `name`.
2. **Swap the menu**: edit `src/app/navigation.ts` (`navigation` plus the `paths` of `navigationGroups` decide groups and order). Menus may also come from a backend — see `src/app/remote-menu.ts`.
3. **Swap identity**: replace `demoAccounts` in `src/app/session.ts` with your session data, and make the sign-out callback call your identity service.
4. **Wire APIs**: replace the sample data (`src/pages/sample-data.ts`, `src/lib/notifications.ts`) with real queries, and use `LoadingState` / `EmptyState` / `ErrorState` for the three boundary states.
5. **Swap copy**: `src/lib/i18n.ts` is the single language entry; Chinese and English must stay in sync. Menu items may start as plain text — unregistered keys render as-is.
6. **Swap brand**: overwrite `mark.svg`, `mark-dark.svg`, `wordmark-light.svg`, `wordmark-dark.svg` in `public/brand/`; no component changes needed.
7. **Swap environment variables**: in `.env.development` / `.env.production` / `.env.test`, set `VITE_APP_TITLE`, `VITE_APP_STORAGE_PREFIX` (storage prefix — always change it), `VITE_APP_PLATFORM_WEB_BASEURL` (terminal banner, console output, sidebar link), `VITE_APP_DISABLE_DEVTOOL`, `VITE_BUILD_SOURCEMAP` and `VITE_BUILD_COMPRESS` (pre-compression, off by default).

## Key conventions

- **Semantic tokens only for color**: `bg-card`, `text-muted-foreground`, `border-border`, `text-success` … Semantic colors (success / warning / info / danger) stay separate from the brand color (`brand-lime`).
- **Light and dark, six palettes**: `palettes.css` (presets) + `custom-palettes.css` (base color × theme color) + `accessibility.css` (high contrast, grayscale, color-weak).
- **Preferences stay in the browser**: theme, palette, accessibility, notifications, header action order, sidebar width/radius/animation/layout mode, table column widths, filter presets and shortcuts live in `localStorage`, all keyed with `VITE_APP_STORAGE_PREFIX`.
- **Menus can come from the backend**: replace `fetchRemoteMenu()` in `src/app/remote-menu.ts`; items support **nesting (`children`)**, **external links with an open mode (new window / same window / iframe)**, icon names, i18n keys, ordering, `hidden` and permission codes. Dynamic pages must be registered locally (`src/app/remote-pages.tsx`) — the API can only reference them, never add new ones.
- **Two test accounts**: the sign-in page fills `admin` (`*` — everything) and `test` (restricted) so you can see menus, route guards and button permissions differ.
- **Frontend permissions in three places**: menus are filtered, routes fall back to 403 through `RequirePermission`, buttons hide or disable through `<Can>`; codes support `*` and `<namespace>.<resource>.*`.
- **Accessibility**: everything is keyboard reachable, dialogs manage focus, tables/trees/controls carry ARIA attributes, and semantic contrast is asserted at WCAG AA in Playwright.
- **Zero-dependency charts**: line/column/donut/mini/heatmap/radar/funnel/gantt are hand-drawn in `src/components/charts.tsx` and `column-chart.tsx`; when you need more, draw it or add a library on the business side.

## Boundaries of the sample data

- Dashboard metrics, customers, orders, notifications and org units are **in-memory sample data** — a refresh resets them, including notification read state (only preferences persist).
- Sign-in / register / forgot-password demonstrate the form and validation only, with **no identity service**; sign-out just navigates.
- Upload, mention, shortcuts and table virtual scrolling already expose their seams (`uploader`, `onMove`, `loadChildren`, `virtual`), so wiring the real implementation means replacing a callback.

## Not included

Authentication and sessions, an API client and error codes, the permission model, chart libraries, decorative
marketing motion, and heavy capabilities such as QR codes / syntax highlighting / Iconify icon packs.

Authentication and sessions, the API client and error codes, and the permission model are provided by
[Standard Admin Backend](https://github.com/runlume/admin-java).

## License

[Apache-2.0](LICENSE), Copyright 2026 Runlume. Copy it into commercial products freely — just keep the copyright
and license notice and ship [LICENSE](LICENSE) plus [NOTICE](NOTICE) with any distribution. The license grants an
express patent license but no trademark rights. The marks under `public/brand/` are brand assets, so replace them
with your own. Details: [docs/guide/license.md](docs/guide/license.md).
