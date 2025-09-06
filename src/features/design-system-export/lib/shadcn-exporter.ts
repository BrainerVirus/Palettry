// --- Base Palette Builder ---
import type { Palette } from "@/features/shared/types/global";
import { ColorMath } from "@/features/palette-generation/lib/color-math";
import { normalizeFull, findAndNormalize } from "./palette-utils";

type CssVars = Record<string, string>;

export class ShadcnExporter {
	private static generateChartColors(primaryColor: string): CssVars {
		const { l, c, h } = ColorMath.parseOklch(primaryColor);

		// Generate chart colors as variations of the primary color
		const variations = [
			{ l: l, c: c, h: h }, // chart-1: base primary
			{ l: l - 0.08, c: c + 0.03, h: h - 0.09 }, // chart-2: slightly darker, more chroma
			{ l: l - 0.13, c: c + 0.03, h: h - 0.09 }, // chart-3: darker
			{ l: l - 0.19, c: c - 0.02, h: h + 0.1 }, // chart-4: much darker, less chroma
			{ l: l - 0.23, c: c - 0.06, h: h + 1.59 }, // chart-5: darkest, least chroma
		];

		const chartVars: CssVars = {};
		variations.forEach((variation, index) => {
			chartVars[`--chart-${index + 1}`] = normalizeFull(
				ColorMath.formatOklch(variation.l, variation.c, variation.h),
				`oklch(${variation.l} ${variation.c} ${variation.h})`
			);
		});

		return chartVars;
	}

	private static lightVars(method: Palette): CssVars {
		const { tonalScale, neutralScale, baseScale, semanticColors } = method;
		const primary500 = tonalScale.find((s) => s.scale === "primary-500");
		const primaryColor = primary500?.color || "oklch(0.59 0.20 277.06)";
		const _chartColors = this.generateChartColors(primaryColor);

		return {
			"--background": findAndNormalize("base-50", tonalScale, baseScale, "oklch(1 0 0)"),
			"--foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.28 0.04 260.33)"
			),
			"--card": findAndNormalize("base-50", tonalScale, baseScale, "oklch(0.99 0 0)"),
			"--card-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.28 0.04 260.33)"
			),
			"--popover": findAndNormalize("base-50", tonalScale, baseScale, "oklch(0.99 0 0)"),
			"--popover-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.28 0.04 260.33)"
			),
			"--primary": normalizeFull(primaryColor, "oklch(0.59 0.20 277.06)"),
			"--primary-foreground": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(1.00 0 0)"
			),
			"--secondary": findAndNormalize(
				"neutral-100",
				tonalScale,
				neutralScale,
				"oklch(0.93 0.01 261.82)"
			),
			"--secondary-foreground": findAndNormalize(
				"neutral-600",
				tonalScale,
				neutralScale,
				"oklch(0.37 0.03 259.73)"
			),
			"--muted": findAndNormalize("base-300", tonalScale, baseScale, "oklch(0.97 0 0)"),
			"--muted-foreground": findAndNormalize(
				"neutral-400",
				tonalScale,
				neutralScale,
				"oklch(0.55 0.02 264.41)"
			),
			"--accent": findAndNormalize(
				"neutral-100",
				tonalScale,
				neutralScale,
				"oklch(0.93 0.03 273.66)"
			),
			"--accent-foreground": findAndNormalize(
				"neutral-600",
				tonalScale,
				neutralScale,
				"oklch(0.37 0.03 259.73)"
			),
			"--destructive": normalizeFull(semanticColors.error.color, "oklch(0.64 0.21 25.39)"),
			"--border": findAndNormalize(
				"neutral-200",
				tonalScale,
				neutralScale,
				"oklch(0.87 0.01 261.81)"
			),
			"--input": findAndNormalize(
				"neutral-200",
				tonalScale,
				neutralScale,
				"oklch(0.87 0.01 261.81)"
			),
			"--ring": normalizeFull(primaryColor, "oklch(0.59 0.20 277.06)"),
			"--sidebar": findAndNormalize("base-300", tonalScale, baseScale, "oklch(0.97 0 0)"),
			"--sidebar-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.28 0.04 260.33)"
			),
			"--sidebar-primary": normalizeFull(primaryColor, "oklch(0.59 0.20 277.06)"),
			"--sidebar-primary-foreground": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(1.00 0 0)"
			),
			"--sidebar-accent": findAndNormalize(
				"neutral-100",
				tonalScale,
				neutralScale,
				"oklch(0.93 0.03 273.66)"
			),
			"--sidebar-accent-foreground": findAndNormalize(
				"neutral-600",
				tonalScale,
				neutralScale,
				"oklch(0.37 0.03 259.73)"
			),
			"--sidebar-border": findAndNormalize(
				"neutral-200",
				tonalScale,
				neutralScale,
				"oklch(0.87 0.01 261.81)"
			),
			"--sidebar-ring": normalizeFull(primaryColor, "oklch(0.59 0.20 277.06)"),

			// Fonts
			"--font-sans": "Inter, sans-serif",
			"--font-serif": "Merriweather, serif",
			"--font-mono": "JetBrains Mono, monospace",

			// Radius
			"--radius": "0.5rem",

			// Shadows
			"--shadow-2xs": "0px 4px 8px -1px oklch(0.00 0 0 / 0.05)",
			"--shadow-xs": "0px 4px 8px -1px oklch(0.00 0 0 / 0.05)",
			"--shadow-sm":
				"0px 4px 8px -1px oklch(0.00 0 0 / 0.10), 0px 1px 2px -2px oklch(0.00 0 0 / 0.10)",
			"--shadow":
				"0px 4px 8px -1px oklch(0.00 0 0 / 0.10), 0px 1px 2px -2px oklch(0.00 0 0 / 0.10)",
			"--shadow-md":
				"0px 4px 8px -1px oklch(0.00 0 0 / 0.10), 0px 2px 4px -2px oklch(0.00 0 0 / 0.10)",
			"--shadow-lg":
				"0px 4px 8px -1px oklch(0.00 0 0 / 0.10), 0px 4px 6px -2px oklch(0.00 0 0 / 0.10)",
			"--shadow-xl":
				"0px 4px 8px -1px oklch(0.00 0 0 / 0.10), 0px 8px 10px -2px oklch(0.00 0 0 / 0.10)",
			"--shadow-2xl": "0px 4px 8px -1px oklch(0.00 0 0 / 0.25)",

			..._chartColors,
		};
	}

	private static darkVars(method: Palette): CssVars {
		const { tonalScale, neutralScale, baseScale, semanticColors } = method;
		const primary500 = tonalScale.find((s) => s.scale === "primary-500");
		const primaryColor = primary500?.color || "oklch(0.68 0.16 276.93)";

		// Dynamically derive dark chart colors by lightness adjustments around the primary tone
		const { l: pL, c: pC, h: pH } = ColorMath.parseOklch(primaryColor);
		const darkChartAdjustments = [
			{ dl: +8, dc: -0.02, dh: 0 }, // a bit lighter & slightly less chroma for contrast
			{ dl: 0, dc: 0, dh: -5 }, // base
			{ dl: -6, dc: +0.02, dh: +5 }, // darker, more chroma
			{ dl: -12, dc: -0.01, dh: +10 }, // much darker, slight hue shift
			{ dl: -18, dc: -0.04, dh: +15 }, // darkest
		];

		const darkChartVars: CssVars = {};
		darkChartAdjustments.forEach((adj, i) => {
			const newL = ColorMath.clamp(pL * 100 + adj.dl, 5, 95); // compute lightness in 0-100 range
			const newC = Math.max(0.01, pC + adj.dc);
			const newH = (pH + adj.dh + 360) % 360;
			const formatted = ColorMath.formatOklch(newL, newC, newH);
			darkChartVars[`--chart-${i + 1}`] = normalizeFull(formatted, formatted);
		});

		return {
			"--background": findAndNormalize(
				"base-900",
				tonalScale,
				baseScale,
				"oklch(0.21 0.04 264.04)"
			),
			"--foreground": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(0.93 0.01 256.71)"
			),
			"--card": findAndNormalize("base-800", tonalScale, baseScale, "oklch(0.28 0.04 260.33)"),
			"--card-foreground": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(0.93 0.01 256.71)"
			),
			"--popover": findAndNormalize("base-800", tonalScale, baseScale, "oklch(0.28 0.04 260.33)"),
			"--popover-foreground": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(0.93 0.01 256.71)"
			),
			"--primary": normalizeFull(primaryColor, "oklch(0.68 0.16 276.93)"),
			"--primary-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.21 0.04 264.04)"
			),
			"--secondary": findAndNormalize(
				"neutral-700",
				tonalScale,
				neutralScale,
				"oklch(0.34 0.03 261.83)"
			),
			"--secondary-foreground": findAndNormalize(
				"neutral-200",
				tonalScale,
				neutralScale,
				"oklch(0.87 0.01 261.81)"
			),
			"--muted": findAndNormalize("base-800", tonalScale, baseScale, "oklch(0.28 0.04 260.33)"),
			"--muted-foreground": findAndNormalize(
				"neutral-400",
				tonalScale,
				neutralScale,
				"oklch(0.71 0.02 261.33)"
			),
			"--accent": findAndNormalize(
				"neutral-700",
				tonalScale,
				neutralScale,
				"oklch(0.37 0.03 259.73)"
			),
			"--accent-foreground": findAndNormalize(
				"neutral-200",
				tonalScale,
				neutralScale,
				"oklch(0.87 0.01 261.81)"
			),
			"--destructive": normalizeFull(semanticColors.error.color, "oklch(0.64 0.21 25.39)"),
			"--border": findAndNormalize(
				"neutral-700",
				tonalScale,
				neutralScale,
				"oklch(0.45 0.03 257.68)"
			),
			"--input": findAndNormalize(
				"neutral-700",
				tonalScale,
				neutralScale,
				"oklch(0.45 0.03 257.68)"
			),
			"--ring": normalizeFull(primaryColor, "oklch(0.68 0.16 276.93)"),
			"--sidebar": findAndNormalize("base-800", tonalScale, baseScale, "oklch(0.28 0.04 260.33)"),
			"--sidebar-foreground": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(0.93 0.01 256.71)"
			),
			"--sidebar-primary": normalizeFull(primaryColor, "oklch(0.68 0.16 276.93)"),
			"--sidebar-primary-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.21 0.04 264.04)"
			),
			"--sidebar-accent": findAndNormalize(
				"neutral-700",
				tonalScale,
				neutralScale,
				"oklch(0.37 0.03 259.73)"
			),
			"--sidebar-accent-foreground": findAndNormalize(
				"neutral-200",
				tonalScale,
				neutralScale,
				"oklch(0.87 0.01 261.81)"
			),
			"--sidebar-border": findAndNormalize(
				"neutral-700",
				tonalScale,
				neutralScale,
				"oklch(0.45 0.03 257.68)"
			),
			"--sidebar-ring": normalizeFull(primaryColor, "oklch(0.68 0.16 276.93)"),

			// Dark mode shadows
			"--shadow-2xs": "0 1px 3px 0px oklch(0.00 0 0 / 0.05)",
			"--shadow-xs": "0 1px 3px 0px oklch(0.00 0 0 / 0.05)",
			"--shadow-sm": "0 1px 3px 0px oklch(0.00 0 0 / 0.10), 0 1px 2px -1px oklch(0.00 0 0 / 0.10)",
			"--shadow": "0 1px 3px 0px oklch(0.00 0 0 / 0.10), 0 1px 2px -1px oklch(0.00 0 0 / 0.10)",
			"--shadow-md": "0 1px 3px 0px oklch(0.00 0 0 / 0.10), 0 2px 4px -1px oklch(0.00 0 0 / 0.10)",
			"--shadow-lg": "0 1px 3px 0px oklch(0.00 0 0 / 0.10), 0 4px 6px -1px oklch(0.00 0 0 / 0.10)",
			"--shadow-xl": "0 1px 3px 0px oklch(0.00 0 0 / 0.10), 0 8px 10px -1px oklch(0.00 0 0 / 0.10)",
			"--shadow-2xl": "0 1px 3px 0px oklch(0.00 0 0 / 0.25)",

			...darkChartVars,
		};
	}

	private static formatVars(vars: CssVars, selector: string): string {
		const lines = Object.entries(vars)
			.map(([k, v]) => `  ${k}: ${v};`)
			.join("\n");
		return `${selector} {\n${lines}\n}`;
	}

	static generateTailwindV4CSS(method: Palette): string {
		const themeMap = `@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}`;

		const light = this.formatVars(this.lightVars(method), ":root");
		const dark = this.formatVars(this.darkVars(method), ".dark");

		const base = `@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}`;

		return `${themeMap}\n\n${light}\n\n${dark}\n\n${base}\n`;
	}
}
