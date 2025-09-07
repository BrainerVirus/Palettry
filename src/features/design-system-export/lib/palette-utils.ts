import { ColorMath } from "@/features/palette-generation/lib/color-math";
import { clampChroma } from "culori";
import type { ColorShade } from "@/features/shared/types/global";
import { normalizeHue } from "@/features/shared/lib/utils";

type CssVars = Record<string, string>;

// Parses "oklch(L% C H)" or "oklch(L C H)" and returns a full "oklch(L C H)" string
// with L as a 0-1 decimal, matching the shadcn/ui theme format.
export const normalizeFull = (oklchStr: string, fallback: string): string => {
	const match = oklchStr.match(/oklch\(\s*([0-9.]+)(%?)\s+([0-9.]+)\s+([0-9.]+)\s*\)/i);
	if (!match) return fallback;

	const l = parseFloat(match[1]);
	const isPct = match[2] === "%";
	const lDecimal = isPct ? l / 100 : l;

	return `oklch(${lDecimal.toFixed(3)} ${parseFloat(match[3]).toFixed(3)} ${parseFloat(match[4]).toFixed(3)})`;
};

// Finds a shade from a scale and returns its normalized color string.
export const findAndNormalize = (
	scaleName: string,
	tonalScale: ColorShade[],
	neutralScale: ColorShade[],
	fallback: string
): string => {
	const found =
		tonalScale.find((s) => s.scale === scaleName) ||
		neutralScale.find((s) => s.scale === scaleName);
	return normalizeFull(found?.color ?? fallback, fallback);
};

// Generates a set of 5 distinct and vibrant chart colors.
export const generateChartColors = (primaryHue: number): { light: CssVars; dark: CssVars } => {
	const hues = [
		normalizeHue(primaryHue + 30),
		normalizeHue(primaryHue + 90),
		normalizeHue(primaryHue + 180),
		normalizeHue(primaryHue + 270),
		normalizeHue(primaryHue - 30),
	];
	const lightModePersonality = { l: 70, c: 0.15 };
	const darkModePersonality = { l: 75, c: 0.2 };

	const light = hues.reduce((acc, h, i) => {
		const inGamut = clampChroma(
			{ l: lightModePersonality.l / 100, c: lightModePersonality.c, h, mode: "oklch" },
			"oklch"
		);
		acc[`--chart-${i + 1}`] = normalizeFull(
			ColorMath.formatOklch(inGamut.l * 100, inGamut.c, inGamut.h),
			"oklch(0.7 0.15 0)"
		);
		return acc;
	}, {} as CssVars);

	const dark = hues.reduce((acc, h, i) => {
		const inGamut = clampChroma(
			{ l: darkModePersonality.l / 100, c: darkModePersonality.c, h, mode: "oklch" },
			"oklch"
		);
		acc[`--chart-${i + 1}`] = normalizeFull(
			ColorMath.formatOklch(inGamut.l * 100, inGamut.c, inGamut.h),
			"oklch(0.75 0.20 0)"
		);
		return acc;
	}, {} as CssVars);

	return { light, dark };
};

// Helper to get a base color by scale
export const getBaseColor = (scale: string, baseScale: ColorShade[], fallback: string): string => {
	const found = baseScale.find((s) => s.scale === scale);
	return normalizeFull(found?.color ?? fallback, fallback);
};

// Helper to get a base foreground by scale
export const getBaseForeground = (
	scale: string,
	baseScale: ColorShade[],
	fallback: string
): string => {
	const found = baseScale.find((s) => s.scale === scale);
	return normalizeFull(found?.foreground ?? fallback, fallback);
};

// Helper to get a shade color by scale
export const getShadeColor = (scale: string, shades: ColorShade[], fallback: string): string => {
	const found = shades.find((s) => s.scale === scale);
	return normalizeFull(found?.color ?? fallback, fallback);
};

// Helper to get a shade foreground by scale
export const getShadeForeground = (
	scale: string,
	shades: ColorShade[],
	fallback: string
): string => {
	const found = shades.find((s) => s.scale === scale);
	return normalizeFull(found?.foreground ?? fallback, fallback);
};
