import { signal, effect } from "@preact/signals-react";
import { PaletteBuilder } from "@/features/palette-generation/lib/palette-builder";
import type { Palette } from "@/features/shared/types/global";

// Reactive signal for the primary color input
export const primaryColor = signal<string>("oklch(49.6% 0.272 303.89)");
export const palette = signal<Palette>({
	name: "Invalid Palette",
	description: `Failed to generate}`,
	tonalScale: [
		{ scale: "primary-50", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-100", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-200", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-300", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-400", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-500", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-600", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-700", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-800", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-900", color: "", l: 0, c: 0, h: 0 },
		{ scale: "primary-950", color: "", l: 0, c: 0, h: 0 },
	],
	semanticColors: {
		success: { color: "", foreground: "" },
		warning: { color: "", foreground: "" },
		error: { color: "", foreground: "" },
		info: { color: "", foreground: "" },
	},
	neutralScale: [
		{ scale: "neutral-50", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-100", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-200", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-300", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-400", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-500", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-600", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-700", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-800", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-900", color: "", l: 0, c: 0, h: 0 },
		{ scale: "neutral-950", color: "", l: 0, c: 0, h: 0 },
	],
	chartScale: [
		{ scale: "chart-1", color: "", l: 0, c: 0, h: 0 },
		{ scale: "chart-2", color: "", l: 0, c: 0, h: 0 },
		{ scale: "chart-3", color: "", l: 0, c: 0, h: 0 },
		{ scale: "chart-4", color: "", l: 0, c: 0, h: 0 },
		{ scale: "chart-5", color: "", l: 0, c: 0, h: 0 },
	],
});

export const setPrimaryColor = (value: string) => {
	primaryColor.value = value;
};

export const setPalette = (value: Palette) => {
	palette.value = value;
};

effect(() => {
	palette.value = PaletteBuilder.buildPalette(primaryColor.value);
});
