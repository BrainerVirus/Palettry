import { describe, it, expect } from "vitest";
import { DaisyUIExporter } from ".";
import type { Palette } from "@/core/palette/types";

// Minimal fake palette aligned with expected structure.
import type { ColorShade } from "@/core/palette/types";

const makeShade = (scale: string, color: string, foreground?: string): ColorShade => ({
	scale,
	color,
	foreground,
	l: 0,
	c: 0,
	h: 0,
});

const fakePalette: Palette = {
	name: "test",
	description: "test palette",
	tonalScale: [
		makeShade("brand-300", "oklch(0.77 0.152 181.912)", "oklch(0.38 0.063 188.416)"),
		makeShade("brand-500", "oklch(0.58 0.233 277.117)", "oklch(0.96 0.018 272.314)"),
		makeShade("brand-600", "oklch(0.45 0.24 277.023)", "oklch(0.93 0.034 272.788)"),
	],
	neutralScale: [
		makeShade("neutral-50", "oklch(0.94 0.028 342.258)", "oklch(0.29 0.066 243.157)"),
		makeShade("neutral-200", "oklch(0.65 0.241 354.308)", "oklch(0.41 0.112 45.904)"),
		makeShade("neutral-500", "oklch(0.14 0.005 285.823)", "oklch(0.92 0.004 286.32)"),
		makeShade("neutral-600", "oklch(0.65 0.241 354.308)", "oklch(0.94 0.028 342.258)"),
	],
	baseScale: [
		makeShade("base-50", "oklch(0.995 0.001 0)", "oklch(0.21 0.006 285.885)"),
		makeShade("base-100", "oklch(1 0 0)", "oklch(0.21 0.006 285.885)"),
		makeShade("base-200", "oklch(0.98 0 0)", "oklch(0.21 0.006 285.885)"),
		makeShade("base-300", "oklch(0.95 0 0)", "oklch(0.21 0.006 285.885)"),
		makeShade("base-700", "oklch(0.2115 0.012 254.09)", "oklch(0.97807 0.029 256.847)"),
		makeShade("base-800", "oklch(0.2326 0.014 253.1)", "oklch(0.97807 0.029 256.847)"),
		makeShade("base-900", "oklch(0.2533 0.016 252.42)", "oklch(0.97807 0.029 256.847)"),
	],
	semanticColors: {
		info: { color: "oklch(0.74 0.16 232.661)", foreground: "oklch(0.29 0.066 243.157)" },
		success: { color: "oklch(0.76 0.177 163.223)", foreground: "oklch(0.37 0.077 168.94)" },
		warning: { color: "oklch(0.82 0.189 84.429)", foreground: "oklch(0.41 0.112 45.904)" },
		error: { color: "oklch(0.71 0.194 13.428)", foreground: "oklch(0.27 0.105 12.094)" },
	},
	chartScale: [
		makeShade("chart-1", "oklch(0.7 0.15 30)", "oklch(0.1 0.01 30)"),
		makeShade("chart-2", "oklch(0.7 0.15 90)", "oklch(0.1 0.01 90)"),
		makeShade("chart-3", "oklch(0.7 0.15 180)", "oklch(0.1 0.01 180)"),
	],
};

describe("DaisyUIExporter.generateDaisyUIThemes", () => {
	it("produces two @plugin theme blocks (light + dark)", () => {
		const css = DaisyUIExporter.generateDaisyUIThemes(fakePalette);
		expect(css).toMatch(/name: "light"/);
		expect(css).toMatch(/name: "dark"/);
		expect(css.split("@plugin").length - 1).toBe(2);
	});
});
