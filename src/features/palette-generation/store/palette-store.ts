import { signal, effect } from "@preact/signals-react";
import { PaletteBuilder } from "@/features/palette-generation/lib/palette-builder";
import type { Palette } from "@/features/shared/types/global";

// Reactive signal for the primary color input
export const primaryColor = signal<string>("oklch(49.6% 0.272 303.89)");
export const palette = signal<Palette>({
	name: "Invalid Palette",
	description: `Failed to generate}`,
	baseScale: [
		{ scale: "base-50", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-100", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-200", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-300", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-400", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-500", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-600", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-700", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-800", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-900", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "base-950", color: "", l: 0, c: 0, h: 0, foreground: "" },
	],
	tonalScale: [
		{ scale: "primary-50", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-100", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-200", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-300", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-400", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-500", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-600", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-700", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-800", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-900", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "primary-950", color: "", l: 0, c: 0, h: 0, foreground: "" },
	],
	semanticColors: {
		success: { color: "", foreground: "" },
		warning: { color: "", foreground: "" },
		error: { color: "", foreground: "" },
		info: { color: "", foreground: "" },
	},
	neutralScale: [
		{ scale: "neutral-50", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-100", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-200", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-300", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-400", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-500", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-600", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-700", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-800", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-900", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "neutral-950", color: "", l: 0, c: 0, h: 0, foreground: "" },
	],
	chartScale: [
		{ scale: "chart-1", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "chart-2", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "chart-3", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "chart-4", color: "", l: 0, c: 0, h: 0, foreground: "" },
		{ scale: "chart-5", color: "", l: 0, c: 0, h: 0, foreground: "" },
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
