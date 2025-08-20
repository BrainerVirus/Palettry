# Copilot Instructions for Color Palette Creator

## Project Overview
- **Purpose:** Generate, preview, and export accessible color palettes for design systems using OKLCH color science.
- **Stack:** Astro (site framework), React (UI), TypeScript (logic), Tailwind CSS (styling).
- **Key Features:**
  - Palette generation from a single primary color (OKLCH-based)
  - Semantic color mapping (success, warning, error, info)
  - Export as CSS variables for shadcn/ui, DaisyUI, or custom systems
  - Live preview with accessibility/contrast hints

## Architecture & Structure
- `src/features/` contains all major features, each in its own folder:
  - `palette-generation/`: Palette logic, UI, and state (see `lib/`, `components/`, `store/`)
  - `design-system-export/`: Export logic (e.g., `shadcn-exporter.ts`), export UI (`export-panel.tsx`)
  - `shared/`: Reusable UI components, types, and utilities
- `src/layouts/` and `src/pages/` use Astro for routing and layout
- Main entry: `src/pages/index.astro` loads the React app (`PaletteGeneratorApp`)

## Developer Workflows
- **Install:** `pnpm install`
- **Dev server:** `pnpm dev` (localhost:4321)
- **Build:** `pnpm build` (output: `./dist/`)
- **Preview:** `pnpm preview`
- **Lint/Format:**
  - ESLint config: `eslint.config.js` (Astro, React, TypeScript, Prettier)
  - Prettier config: `.prettierrc.mjs` (Astro, Tailwind plugins)

## Patterns & Conventions
- **Feature-first organization:** Each feature is self-contained (UI, logic, types, state)
- **TypeScript everywhere:** All business logic and components are typed
- **OKLCH color space:** Palette generation and manipulation uses OKLCH for perceptual uniformity
- **Export logic:**
  - `ShadcnExporter` in `design-system-export/lib/` generates CSS variables for design systems
  - Export UI (`export-panel.tsx`) lets users copy/download generated CSS
- **State management:** Uses `@preact/signals-react` for palette state
- **Component imports:** Use `@/` alias for `src/`

## Integration Points
- **Astro + React:** Astro pages/layouts load React components for interactivity
- **Tailwind CSS:** Used for all styling; see `astro.config.mjs` for integration
- **shadcn/ui, DaisyUI:** Exported palettes are compatible with these libraries

## Examples
- Palette generation: `src/features/palette-generation/lib/palette-builder.ts`
- Export logic: `src/features/design-system-export/lib/shadcn-exporter.ts`
- Main UI: `src/features/palette-generation/components/palette-generator-app.tsx`

## Additional Notes
- **No test suite is present** (as of August 2025)
- **Accessibility:** Contrast and accessibility are surfaced in the UI
- **License:** MIT (see `LICENSE.md`)
