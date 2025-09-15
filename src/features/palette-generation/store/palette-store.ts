import { signal, computed } from "@preact/signals-react";
import { PaletteBuilder } from "@/features/palette-generation/lib/palette-builder";
import type { Palette } from "@/features/shared/types/global";

// Reactive signal for the brand color input
export const brandColor = signal<string>("oklch(49.6% 0.272 303.89)");
export const palette = computed<Palette>(() => PaletteBuilder.buildPalette(brandColor.value));

export const setBrandColor = (value: string) => {
	brandColor.value = value;
};
