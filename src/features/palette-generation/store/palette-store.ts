import { signal, computed } from "@preact/signals-react";
import { PaletteBuilder } from "@/core/palette/palette-builder";
import type { Palette } from "@/core/palette/types";

// Reactive signal for the brand color input
export const brandColor = signal<string>("oklch(49.6% 0.272 303.89)");
export const palette = computed<Palette>(() => PaletteBuilder.buildPalette(brandColor.value));

export const setBrandColor = (value: string) => {
	brandColor.value = value;
};
