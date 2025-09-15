# Palettry

Tool for designers and developers to generate, preview, and export accessible color palettes for design systems. Built with Astro, React, and TypeScript, it leverages advanced color science (OKLCH) to help you create visually consistent and accessible palettes for use in modern UI libraries like shadcn/ui and DaisyUI.

### `src/` Structure Overview

```
src/
├── assets/                # Static assets (images, icons, etc.)
├── features/              # Top-level features, each in its own folder
│   ├── palette-generation/
│   │   ├── components/    # UI components for palette generation
│   │   ├── lib/           # Business logic for palette generation
│   │   ├── store/         # State management for palette generation
│   ├── design-system-export/
│   │   ├── components/    # UI for exporting palettes to design systems
│   │   ├── lib/           # Export logic (e.g., shadcn/ui, DaisyUI)
│   ├── shared/
│   │   ├── components/    # Shared UI components (e.g., Card, Button, Head)
│   │   ├── types/         # Global TypeScript types and interfaces
│   │   ├── lib/           # Shared utilities
├── layouts/               # App-wide layout components (Astro)
├── pages/                 # Astro pages (entry points)
├── styles/                # Global and feature-specific CSS
```

### ✨ Key Features

- **OKLCH-Based Palette Generation:**  
  Generate color palettes using the perceptually uniform OKLCH color space, ensuring smooth gradients and consistent visual weight across hues.

- **Semantic Color Mapping:**  
  Automatically generate semantic colors (success, warning, error, info) that match your brand’s “personality” and maintain accessibility.

- **Tonal & Neutral Scales:**  
  Create full tonal scales (light to dark) and neutral palettes for backgrounds, borders, and surfaces.

- **Design System Export:**  
  Export your palette as CSS variables ready for shadcn/ui, DaisyUI, or custom design systems. Copy or download the output instantly.

- **Live Preview:**  
  Instantly preview your palette and semantic colors in a UI context, including contrast checks and accessibility hints.

- **Customizable & Extensible:**  
  Easily tweak palette generation logic, add new export formats, or extend with your own features.

### 🛠️ How It Works

1. **Input a Brand Color:**  
   Start with your brand color in OKLCH format.

2. **Generate Palette:**  
   The app builds a full tonal scale, semantic colors, and neutral variants using color science best practices.

3. **Preview & Adjust:**  
   See your palette in action, check contrast, and fine-tune as needed.

4. **Export:**  
   Copy or download your palette as ready-to-use CSS variables for your favorite design system.

## 🧞 Commands

All commands are run from the root of the project:

| Command        | Action                                     |
| -------------- | ------------------------------------------ |
| `pnpm install` | Install dependencies                       |
| `pnpm dev`     | Start local dev server at `localhost:4321` |
| `pnpm build`   | Build your production site to `./dist/`    |
| `pnpm preview` | Preview your build locally                 |

## 👀 Learn More

- [Astro Documentation](https://docs.astro.build)
- [OKLCH Color](https://oklch.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [DaisyUI](https://daisyui.com/)
