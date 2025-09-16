import type { SemanticHueConstraints } from "@/core/palette/types";

// Moved from scales/hue-constraints.ts
export const SEMANTIC_HUE_CONSTRAINTS: SemanticHueConstraints = {
	success: { hue: 140, l: [45, 70], c: [0.12, 0.2] },
	warning: { hue: 70, l: [65, 80], c: [0.1, 0.18] },
	error: { hue: 25, l: [50, 65], c: [0.18, 0.25] },
	info: { hue: 240, l: [45, 65], c: [0.15, 0.22] },
} as const;
