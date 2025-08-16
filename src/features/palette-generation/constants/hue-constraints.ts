import type { HueConstraints } from "@/features/shared/types/global";

export const HUE_CONSTRAINTS: HueConstraints = {
	success: { hue: 140, l: [45, 70], c: [0.12, 0.2] },
	warning: { hue: 70, l: [65, 80], c: [0.1, 0.18] },
	error: { hue: 25, l: [50, 65], c: [0.18, 0.25] },
	info: { hue: 240, l: [45, 65], c: [0.15, 0.22] },
} as const;
