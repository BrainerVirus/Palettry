import type { PaletteMethod } from "@/features/shared/types/global";

// features/palette-generation/types/palette.ts
export interface GenerationOptions {
	method: "standard" | "perceptual" | "energy";
	baseColor: string;
}

export interface GenerationResult {
	success: boolean;
	data?: PaletteMethod;
	error?: string;
}
