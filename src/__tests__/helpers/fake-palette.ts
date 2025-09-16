import type { Palette, ColorShade } from "@/core/palette/types";

const makeShade = (scale: string, color: string, foreground?: string): ColorShade => ({
	scale,
	color,
	foreground,
	l: 0,
	c: 0,
	h: 0,
});

export function buildFakePalette(name = "test"): Palette {
	return {
		name,
		description: "generated for tests",
		tonalScale: [
			makeShade("brand-300", "oklch(0.77 0.15 182)", "oklch(0.38 0.06 188)"),
			makeShade("brand-500", "oklch(0.58 0.23 277)", "oklch(0.96 0.02 272)"),
			makeShade("brand-600", "oklch(0.45 0.24 277)", "oklch(0.93 0.03 272)"),
		],
		neutralScale: [
			makeShade("neutral-50", "oklch(0.94 0.02 342)", "oklch(0.29 0.06 243)"),
			makeShade("neutral-200", "oklch(0.65 0.24 354)", "oklch(0.41 0.11 46)"),
			makeShade("neutral-500", "oklch(0.14 0.00 286)", "oklch(0.92 0.00 286)"),
			makeShade("neutral-600", "oklch(0.65 0.24 354)", "oklch(0.94 0.02 342)"),
		],
		baseScale: [
			makeShade("base-50", "oklch(0.995 0.001 0)", "oklch(0.21 0.006 286)"),
			makeShade("base-100", "oklch(1 0 0)", "oklch(0.21 0.006 286)"),
			makeShade("base-200", "oklch(0.98 0 0)", "oklch(0.21 0.006 286)"),
			makeShade("base-300", "oklch(0.95 0 0)", "oklch(0.21 0.006 286)"),
			makeShade("base-700", "oklch(0.21 0.012 254)", "oklch(0.97 0.029 257)"),
			makeShade("base-800", "oklch(0.23 0.014 253)", "oklch(0.97 0.029 257)"),
			makeShade("base-900", "oklch(0.25 0.016 252)", "oklch(0.97 0.029 257)"),
		],
		semanticColors: {
			info: { color: "oklch(0.74 0.16 233)", foreground: "oklch(0.29 0.06 243)" },
			success: { color: "oklch(0.76 0.18 163)", foreground: "oklch(0.37 0.07 169)" },
			warning: { color: "oklch(0.82 0.19 84)", foreground: "oklch(0.41 0.11 46)" },
			error: { color: "oklch(0.71 0.19 13)", foreground: "oklch(0.27 0.10 12)" },
		},
		chartScale: [
			makeShade("chart-1", "oklch(0.70 0.15 30)", "oklch(0.10 0.01 30)"),
			makeShade("chart-2", "oklch(0.70 0.15 90)", "oklch(0.10 0.01 90)"),
			makeShade("chart-3", "oklch(0.70 0.15 180)", "oklch(0.10 0.01 180)"),
		],
	};
}
