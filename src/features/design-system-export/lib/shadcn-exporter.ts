import type { Palette } from "@/features/shared/types/global";
import { normalizeFull, findAndNormalize } from "./palette-utils";

type CssVars = Record<string, string>;

export class ShadcnExporter {
	private static pick(method: Palette, scale: string, fallback: string) {
		const { tonalScale, neutralScale, baseScale } = method;
		return (
			findAndNormalize(scale, tonalScale, neutralScale, fallback) ||
			findAndNormalize(scale, tonalScale, baseScale, fallback) ||
			fallback
		);
	}

	private static light(method: Palette): CssVars {
		const { tonalScale, neutralScale, semanticColors, chartScale } = method;
		const primary = tonalScale.find((s) => s.scale === "primary-600")?.color || tonalScale[6].color;
		const primaryFg = neutralScale.find((s) => s.scale === "neutral-50")?.color || "oklch(1 0 0)";
		const chartVars: CssVars = {};
		chartScale.forEach((c, i) => {
			chartVars[`--chart-${i + 1}`] = normalizeFull(c.color, c.color);
		});
		return {
			"--radius": "0.65rem",
			"--background": this.pick(method, "base-50", "oklch(1 0 0)"),
			"--foreground": this.pick(method, "neutral-900", "oklch(0.141 0.005 285.823)"),
			"--card": this.pick(method, "base-50", "oklch(1 0 0)"),
			"--card-foreground": this.pick(method, "neutral-900", "oklch(0.141 0.005 285.823)"),
			"--popover": this.pick(method, "base-50", "oklch(1 0 0)"),
			"--popover-foreground": this.pick(method, "neutral-900", "oklch(0.141 0.005 285.823)"),
			"--primary": normalizeFull(primary, primary),
			"--primary-foreground": normalizeFull(primaryFg, primaryFg),
			"--secondary": this.pick(method, "neutral-100", "oklch(0.967 0.001 286.375)"),
			"--secondary-foreground": this.pick(method, "neutral-800", "oklch(0.21 0.006 285.885)"),
			"--muted": this.pick(method, "neutral-100", "oklch(0.967 0.001 286.375)"),
			"--muted-foreground": this.pick(method, "neutral-400", "oklch(0.552 0.016 285.938)"),
			"--accent": this.pick(method, "neutral-100", "oklch(0.967 0.001 286.375)"),
			"--accent-foreground": this.pick(method, "neutral-800", "oklch(0.21 0.006 285.885)"),
			"--destructive": normalizeFull(
				semanticColors.error.color,
				semanticColors.error.color || "oklch(0.577 0.245 27.325)"
			),
			"--border": this.pick(method, "neutral-200", "oklch(0.92 0.004 286.32)"),
			"--input": this.pick(method, "neutral-200", "oklch(0.92 0.004 286.32)"),
			"--ring": normalizeFull(primary, primary),
			"--sidebar": this.pick(method, "base-100", "oklch(0.985 0 0)"),
			"--sidebar-foreground": this.pick(method, "neutral-900", "oklch(0.141 0.005 285.823)"),
			"--sidebar-primary": normalizeFull(primary, primary),
			"--sidebar-primary-foreground": normalizeFull(primaryFg, primaryFg),
			"--sidebar-accent": this.pick(method, "neutral-100", "oklch(0.967 0.001 286.375)"),
			"--sidebar-accent-foreground": this.pick(method, "neutral-800", "oklch(0.21 0.006 285.885)"),
			"--sidebar-border": this.pick(method, "neutral-200", "oklch(0.92 0.004 286.32)"),
			"--sidebar-ring": normalizeFull(primary, primary),
			...chartVars,
		};
	}

	private static dark(method: Palette): CssVars {
		const { tonalScale, semanticColors, chartScale } = method;
		const primary = tonalScale.find((s) => s.scale === "primary-500")?.color || tonalScale[5].color;
		const primaryFg = tonalScale.find((s) => s.scale === "primary-300")?.color || primary;
		const chartVars: CssVars = {};
		chartScale.forEach((c, i) => {
			chartVars[`--chart-${i + 1}`] = normalizeFull(c.color, c.color);
		});
		return {
			"--background": this.pick(method, "neutral-900", "oklch(0.141 0.005 285.823)"),
			"--foreground": this.pick(method, "base-50", "oklch(0.985 0 0)"),
			"--card": this.pick(method, "neutral-800", "oklch(0.21 0.006 285.885)"),
			"--card-foreground": this.pick(method, "base-50", "oklch(0.985 0 0)"),
			"--popover": this.pick(method, "neutral-800", "oklch(0.21 0.006 285.885)"),
			"--popover-foreground": this.pick(method, "base-50", "oklch(0.985 0 0)"),
			"--primary": normalizeFull(primary, primary),
			"--primary-foreground": normalizeFull(primaryFg, primaryFg),
			"--secondary": this.pick(method, "neutral-700", "oklch(0.274 0.006 286.033)"),
			"--secondary-foreground": this.pick(method, "base-50", "oklch(0.985 0 0)"),
			"--muted": this.pick(method, "neutral-700", "oklch(0.274 0.006 286.033)"),
			"--muted-foreground": this.pick(method, "neutral-400", "oklch(0.705 0.015 286.067)"),
			"--accent": this.pick(method, "neutral-700", "oklch(0.274 0.006 286.033)"),
			"--accent-foreground": this.pick(method, "base-50", "oklch(0.985 0 0)"),
			"--destructive": normalizeFull(
				semanticColors.error.color,
				semanticColors.error.color || "oklch(0.704 0.191 22.216)"
			),
			"--border": "oklch(1 0 0 / 10%)",
			"--input": "oklch(1 0 0 / 15%)",
			"--ring": normalizeFull(primaryFg, primaryFg),
			...chartVars,
			"--sidebar": this.pick(method, "neutral-800", "oklch(0.21 0.006 285.885)"),
			"--sidebar-foreground": this.pick(method, "base-50", "oklch(0.985 0 0)"),
			"--sidebar-primary": normalizeFull(primary, primary),
			"--sidebar-primary-foreground": normalizeFull(primaryFg, primaryFg),
			"--sidebar-accent": this.pick(method, "neutral-700", "oklch(0.274 0.006 286.033)"),
			"--sidebar-accent-foreground": this.pick(method, "base-50", "oklch(0.985 0 0)"),
			"--sidebar-border": "oklch(1 0 0 / 10%)",
			"--sidebar-ring": normalizeFull(primaryFg, primaryFg),
		};
	}

	private static toBlock(selector: string, vars: CssVars) {
		return `${selector} {\n${Object.entries(vars)
			.map(([k, v]) => `  ${k}: ${v};`)
			.join("\n")}\n}`;
	}

	static generateTailwindV4CSS(method: Palette): string {
		const light = this.toBlock(":root", this.light(method));
		const dark = this.toBlock(".dark", this.dark(method));
		return `${light}\n\n${dark}\n`;
	}
}
