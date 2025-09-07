import type { Palette } from "@/features/shared/types/global";
import { normalizeFull, findAndNormalize, getBaseColor, getBaseForeground } from "./palette-utils";

type CssVars = Record<string, string>;

export class DaisyUIExporter {
	private static lightVars(method: Palette): CssVars {
		const { tonalScale, neutralScale, semanticColors, baseScale } = method;
		const primary500 = tonalScale.find((s) => s.scale === "primary-500");

		return {
			"--color-base-50": getBaseColor("base-50", baseScale, "oklch(99.5% 0.001 0)"),
			"--color-base-100": getBaseColor("base-100", baseScale, "oklch(100% 0 0)"),
			"--color-base-200": getBaseColor("base-200", baseScale, "oklch(98% 0 0)"),
			"--color-base-300": getBaseColor("base-300", baseScale, "oklch(95% 0 0)"),
			"--color-base-content": getBaseForeground("base-900", baseScale, "oklch(21% 0.006 285.885)"),
			"--color-primary": normalizeFull(
				primary500?.color || "oklch(45% 0.24 277.023)",
				"oklch(45% 0.24 277.023)"
			),
			"--color-primary-content": normalizeFull(
				primary500?.foreground || "oklch(93% 0.034 272.788)",
				"oklch(93% 0.034 272.788)"
			),
			"--color-secondary": findAndNormalize(
				"neutral-200",
				tonalScale,
				neutralScale,
				"oklch(65% 0.241 354.308)"
			),
			"--color-secondary-content": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(94% 0.028 342.258)"
			),
			"--color-accent": findAndNormalize(
				"primary-300",
				tonalScale,
				neutralScale,
				"oklch(77% 0.152 181.912)"
			),
			"--color-accent-content": findAndNormalize(
				"primary-900",
				tonalScale,
				neutralScale,
				"oklch(38% 0.063 188.416)"
			),
			"--color-neutral": findAndNormalize(
				"neutral-500",
				tonalScale,
				neutralScale,
				"oklch(14% 0.005 285.823)"
			),
			"--color-neutral-content": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(92% 0.004 286.32)"
			),
			"--color-info": normalizeFull(semanticColors.info.color, "oklch(74% 0.16 232.661)"),
			"--color-info-content": normalizeFull(
				semanticColors.info.foreground,
				"oklch(29% 0.066 243.157)"
			),
			"--color-success": normalizeFull(semanticColors.success.color, "oklch(76% 0.177 163.223)"),
			"--color-success-content": normalizeFull(
				semanticColors.success.foreground,
				"oklch(37% 0.077 168.94)"
			),
			"--color-warning": normalizeFull(semanticColors.warning.color, "oklch(82% 0.189 84.429)"),
			"--color-warning-content": normalizeFull(
				semanticColors.warning.foreground,
				"oklch(41% 0.112 45.904)"
			),
			"--color-error": normalizeFull(semanticColors.error.color, "oklch(71% 0.194 13.428)"),
			"--color-error-content": normalizeFull(
				semanticColors.error.foreground,
				"oklch(27% 0.105 12.094)"
			),
			"--radius-selector": "0.5rem",
			"--radius-field": "0.25rem",
			"--radius-box": "0.5rem",
			"--size-selector": "0.25rem",
			"--size-field": "0.25rem",
			"--border": "1px",
			"--depth": "1",
			"--noise": "0",
		};
	}

	private static darkVars(method: Palette): CssVars {
		const { tonalScale, neutralScale, semanticColors, baseScale } = method;
		const primary500 = tonalScale.find((s) => s.scale === "primary-500");

		return {
			"--color-base-50": getBaseColor("base-50", baseScale, "oklch(99.5% 0.001 0)"),
			"--color-base-100": getBaseColor("base-900", baseScale, "oklch(25.33% 0.016 252.42)"),
			"--color-base-200": getBaseColor("base-800", baseScale, "oklch(23.26% 0.014 253.1)"),
			"--color-base-300": getBaseColor("base-700", baseScale, "oklch(21.15% 0.012 254.09)"),
			"--color-base-content": getBaseForeground(
				"base-100",
				baseScale,
				"oklch(97.807% 0.029 256.847)"
			),
			"--color-primary": normalizeFull(
				primary500?.color || "oklch(58% 0.233 277.117)",
				"oklch(58% 0.233 277.117)"
			),
			"--color-primary-content": normalizeFull(
				primary500?.foreground || "oklch(96% 0.018 272.314)",
				"oklch(96% 0.018 272.314)"
			),
			"--color-secondary": findAndNormalize(
				"neutral-600",
				tonalScale,
				neutralScale,
				"oklch(65% 0.241 354.308)"
			),
			"--color-secondary-content": findAndNormalize(
				"neutral-100",
				tonalScale,
				neutralScale,
				"oklch(94% 0.028 342.258)"
			),
			"--color-accent": findAndNormalize(
				"primary-300",
				tonalScale,
				neutralScale,
				"oklch(77% 0.152 181.912)"
			),
			"--color-accent-content": findAndNormalize(
				"primary-900",
				tonalScale,
				neutralScale,
				"oklch(38% 0.063 188.416)"
			),
			"--color-neutral": findAndNormalize(
				"neutral-500",
				tonalScale,
				neutralScale,
				"oklch(14% 0.005 285.823)"
			),
			"--color-neutral-content": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(92% 0.004 286.32)"
			),
			"--color-info": normalizeFull(semanticColors.info.color, "oklch(74% 0.16 232.661)"),
			"--color-info-content": normalizeFull(
				semanticColors.info.foreground,
				"oklch(29% 0.066 243.157)"
			),
			"--color-success": normalizeFull(semanticColors.success.color, "oklch(76% 0.177 163.223)"),
			"--color-success-content": normalizeFull(
				semanticColors.success.foreground,
				"oklch(37% 0.077 168.94)"
			),
			"--color-warning": normalizeFull(semanticColors.warning.color, "oklch(82% 0.189 84.429)"),
			"--color-warning-content": normalizeFull(
				semanticColors.warning.foreground,
				"oklch(41% 0.112 45.904)"
			),
			"--color-error": normalizeFull(semanticColors.error.color, "oklch(71% 0.194 13.428)"),
			"--color-error-content": normalizeFull(
				semanticColors.error.foreground,
				"oklch(27% 0.105 12.094)"
			),
			"--radius-selector": "0.5rem",
			"--radius-field": "0.25rem",
			"--radius-box": "0.5rem",
			"--size-selector": "0.25rem",
			"--size-field": "0.25rem",
			"--border": "1px",
			"--depth": "1",
			"--noise": "0",
		};
	}

	private static formatVars(vars: CssVars, selector: string): string {
		const lines = Object.entries(vars)
			.map(([k, v]) => `  ${k}: ${v};`)
			.join("\n");
		return `${selector} {\n${lines}\n}`;
	}

	static generateLightTheme(palette: Palette): string {
		const vars = this.lightVars(palette);
		const lines = Object.entries(vars)
			.map(([k, v]) => `  ${k}: ${v};`)
			.join("\n");
		return `@plugin "daisyui/theme" {
  name: "light";
  default: true;
  prefersdark: false;
  color-scheme: "light";
${lines}
}`;
	}

	static generateDarkTheme(palette: Palette): string {
		const vars = this.darkVars(palette);
		const lines = Object.entries(vars)
			.map(([k, v]) => `  ${k}: ${v};`)
			.join("\n");
		return `@plugin "daisyui/theme" {
  name: "dark";
  default: false;
  prefersdark: true;
  color-scheme: "dark";
${lines}
}`;
	}

	static generateDaisyUIThemes(palette: Palette): string {
		const light = this.generateLightTheme(palette);
		const dark = this.generateDarkTheme(palette);
		return `${light}\n\n${dark}`;
	}
}
