import type { LightnessProgression } from "@/core/palette/types";

export const PRIMARY_COLORS_LIGHTNESS_PROGRESSION_MAP: LightnessProgression[] = [
	{ scale: "50", l: 45.4 },
	{ scale: "100", l: 40.4 },
	{ scale: "200", l: 30.4 },
	{ scale: "300", l: 20.4 },
	{ scale: "400", l: 10.4 },
	{ scale: "500", l: 0 },
	{ scale: "600", l: -7.6 },
	{ scale: "700", l: -14.6 },
	{ scale: "800", l: -21.6 },
	{ scale: "900", l: -29.6 },
	{ scale: "950", l: -37.6 },
] as const;

export const NEUTRAL_COLORS_LIGHTNESS_PROGRESSION_MAP: LightnessProgression[] = [
	{ scale: "50", l: 98 },
	{ scale: "100", l: 95 },
	{ scale: "200", l: 88 },
	{ scale: "300", l: 78 },
	{ scale: "400", l: 65 },
	{ scale: "500", l: 52 },
	{ scale: "600", l: 42 },
	{ scale: "700", l: 32 },
	{ scale: "800", l: 22 },
	{ scale: "900", l: 15 },
	{ scale: "950", l: 8 },
] as const;
