import { ColorMath } from "@/core/palette/color-math";
import { clampChroma } from "culori";
import type { ColorShade } from "@/core/palette/types";
import { normalizeHue } from "@/core/palette/utils/hue";

type CssVars = Record<string, string>;

export const normalizeFull = (oklchStr: string, fallback: string): string => {
	const match = oklchStr.match(/oklch\(\s*([0-9.]+)(%?)\s+([0-9.]+)\s+([0-9.]+)\s*\)/i);
	if (!match) return fallback;
	const l = parseFloat(match[1]);
	const isPct = match[2] === "%";
	const lDecimal = isPct ? l / 100 : l;
	return `oklch(${lDecimal.toFixed(3)} ${parseFloat(match[3]).toFixed(3)} ${parseFloat(match[4]).toFixed(3)})`;
};

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

export const generateChartColors = (brandHue: number): { light: CssVars; dark: CssVars } => {
	const hues = [
		normalizeHue(brandHue + 30),
		normalizeHue(brandHue + 90),
		normalizeHue(brandHue + 180),
		normalizeHue(brandHue + 270),
		normalizeHue(brandHue - 30),
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

export const getBaseColor = (scale: string, baseScale: ColorShade[], fallback: string): string => {
	const found = baseScale.find((s) => s.scale === scale);
	return normalizeFull(found?.color ?? fallback, fallback);
};

export const getBaseForeground = (
	scale: string,
	baseScale: ColorShade[],
	fallback: string
): string => {
	const found = baseScale.find((s) => s.scale === scale);
	return normalizeFull(found?.foreground ?? fallback, fallback);
};

export const getShadeColor = (scale: string, shades: ColorShade[], fallback: string): string => {
	const found = shades.find((s) => s.scale === scale);
	return normalizeFull(found?.color ?? fallback, fallback);
};

export const getShadeForeground = (
	scale: string,
	shades: ColorShade[],
	fallback: string
): string => {
	const found = shades.find((s) => s.scale === scale);
	return normalizeFull(found?.foreground ?? fallback, fallback);
};
