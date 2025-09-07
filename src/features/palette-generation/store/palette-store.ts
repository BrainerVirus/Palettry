import { signal, computed } from "@preact/signals-react";
import { PaletteBuilder } from "@/features/palette-generation/lib/palette-builder";
import type { Palette } from "@/features/shared/types/global";

// Reactive signal for the primary color input
export const primaryColor = signal<string>("oklch(49.6% 0.272 303.89)");
export const palette = computed<Palette>(() => PaletteBuilder.buildPalette(primaryColor.value));

export const setPrimaryColor = (value: string) => {
	primaryColor.value = value;
};
