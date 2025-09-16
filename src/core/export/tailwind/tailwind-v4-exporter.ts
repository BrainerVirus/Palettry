import type { Palette } from "@/core/palette/types";
import { normalizeFull } from "@/core/export/utils/palette-utils";

type CssVars = Record<string, string>;

export class TailwindV4Exporter {
	private static formatVars(vars: CssVars, selector: string): string {
		const lines = Object.entries(vars)
			.map(([k, v]) => `  ${k}: ${v};`)
			.join("\n");
		return `${selector} {\n${lines}\n}`;
	}

	static generateTailwindV4CSS(palette: Palette): string {
		const vars: CssVars = {};
		palette.baseScale.forEach((shade) => {
			const varName = `--color-base-${shade.scale.split("-")[1]}`;
			vars[varName] = normalizeFull(shade.color, "oklch(1 0 0)");
			vars[`${varName}-foreground`] = normalizeFull(
				shade.foreground || "oklch(0 0 0)",
				"oklch(0 0 0)"
			);
		});
		palette.tonalScale.forEach((shade) => {
			const varName = `--color-${shade.scale}`;
			vars[varName] = normalizeFull(shade.color, "oklch(0.5 0.2 240)");
			vars[`${varName}-foreground`] = normalizeFull(
				shade.foreground || "oklch(1 0 0)",
				"oklch(1 0 0)"
			);
		});
		palette.neutralScale.forEach((shade) => {
			const varName = `--color-${shade.scale}`;
			vars[varName] = normalizeFull(shade.color, "oklch(0.5 0 0)");
			vars[`${varName}-foreground`] = normalizeFull(
				shade.foreground || "oklch(1 0 0)",
				"oklch(1 0 0)"
			);
		});
		Object.entries(palette.semanticColors).forEach(([name, colors]) => {
			vars[`--color-${name}`] = normalizeFull(colors.color, "oklch(0.5 0.2 240)");
			vars[`--color-${name}-foreground`] = normalizeFull(colors.foreground, "oklch(1 0 0)");
		});
		palette.chartScale.forEach((shade) => {
			const varName = `--color-${shade.scale}`;
			vars[varName] = normalizeFull(shade.color, "oklch(0.7 0.15 240)");
			vars[`${varName}-foreground`] = normalizeFull(
				shade.foreground || "oklch(0 0 0)",
				"oklch(0 0 0)"
			);
		});

		const themeMap = `@theme inline {
	--radius-sm: calc(var(--radius) - 4px);
	--radius-md: calc(var(--radius) - 2px);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) + 4px);
	--color-background: var(--color-base-100);
	--color-foreground: var(--color-base-900-foreground);
	--color-card: var(--color-base-200);
	--color-card-foreground: var(--color-base-900-foreground);
	--color-popover: var(--color-base-200);
	--color-popover-foreground: var(--color-base-900-foreground);
	--color-primary: var(--color-brand-500);
	--color-primary-foreground: var(--color-brand-500-foreground);
	--color-secondary: var(--color-neutral-200);
	--color-secondary-foreground: var(--color-neutral-50-foreground);
	--color-muted: var(--color-base-300);
	--color-muted-foreground: var(--color-base-900-foreground);
	--color-accent: var(--color-brand-300);
	--color-accent-foreground: var(--color-brand-900-foreground);
	--color-destructive: var(--color-error);
	--color-border: var(--color-base-400);
	--color-input: var(--color-base-200);
	--color-ring: var(--color-brand-400);
	--color-chart-1: var(--color-chart-1);
	--color-chart-2: var(--color-chart-2);
	--color-chart-3: var(--color-chart-3);
	--color-chart-4: var(--color-chart-4);
	--color-chart-5: var(--color-chart-5);
}`;

		const rootVars = this.formatVars(vars, ":root");
		const base = `@layer base {
	* { @apply border-border outline-ring/50; }
	body { @apply bg-background text-foreground; }
}`;
		return `${themeMap}\n\n${rootVars}\n\n${base}\n`;
	}
}
