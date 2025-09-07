import type { OklchColor } from "@/features/shared/types/global";
import {
	L_MIN,
	L_MAX,
	C_MIN,
	C_MAX,
	H_MIN,
	H_MAX,
} from "@/features/shared/constants/color-constraints";

import { converter, wcagLuminance } from "culori";

// Converters from culori
const oklchToRgb = converter("rgb"); // OKLCH object { l, c, h, mode: 'oklch' } to RGB object

export class ColorMath {
	/**
	 * Parse OKLCH string into components.
	 * Expects: "oklch(L% C H)"
	 * Returns: L (L_MIN-L_MAX), C (C_MIN-C_MAX), H (H_MIN-H_MAX)
	 */
	static parseOklch(oklchString: string): OklchColor {
		const match = oklchString.match(/oklch\(\s*([0-9.]+)(%?)\s+([0-9.]+)\s+([0-9.]+)\s*\)/);
		if (!match) {
			throw new Error(`Invalid OKLCH format: ${oklchString}`);
		}

		// L can be % or 0-1 float. Normalize to 0-100 for internal use.
		const l = parseFloat(match[1]);
		const isPercent = match[2] === "%";
		const lightness = isPercent ? l : l * 100;

		return {
			l: lightness, // L_MIN-L_MAX
			c: parseFloat(match[3]), // C_MIN - C_MAX
			h: parseFloat(match[4]), // H_MIN-H_MAX
		};
	}

	/**
	 * Format OKLCH components into string.
	 * Expects: L (L_MIN-L_MAX), C (C_MIN-C_MAX), H (H_MIN-H_MAX)
	 * Formats: "oklch(L.X% C.XXX H.XX)"
	 */
	static formatOklch(l: number, c: number, h: number): string {
		// Ensure values are within typical ranges for formatting, even if clamped elsewhere
		const clampedL = ColorMath.clamp(l, L_MIN, L_MAX);
		const clampedC = ColorMath.clamp(c, C_MIN, C_MAX); // Max chroma is around 0.37 for sRGB gamut
		const normalizedH = h % H_MAX; // Ensure hue wraps around

		return `oklch(${clampedL.toFixed(1)}% ${clampedC.toFixed(3)} ${normalizedH.toFixed(2)})`;
	}

	/**
	 * Calculate perceptual weight of a color
	 */
	static calculateWeight(l: number, c: number): number {
		return (100 - l) * c;
	}

	/**
	 * Calculate energy level of a color (saturation impact vs. lightness)
	 */
	static calculateEnergy(l: number, c: number, baseL: number = 50): number {
		return c * Math.pow(l / baseL, 0.5);
	}

	/**
	 * Adjust chroma based on lightness change (for tonal scales)
	 */
	static adjustChroma(baseC: number, currentL: number, baseL: number): number {
		// Adjust for currentL being outside baseL range
		const lRatio = currentL / baseL;
		const chroma = baseC * Math.pow(lRatio, 0.7);
		return ColorMath.clamp(chroma, 0.005, 0.4); // Clamp to prevent out-of-gamut or too low chroma
	}

	/**
	 * Validate OKLCH color values (basic range check)
	 */
	static validateOklch(color: OklchColor): boolean {
		return (
			color.l >= L_MIN &&
			color.l <= L_MAX &&
			color.c >= C_MIN &&
			color.c <= C_MAX && // Max chroma in sRGB gamut is ~0.37
			color.h >= H_MIN &&
			color.h <= H_MAX
		);
	}

	/**
	 * Clamp value between min and max
	 */
	static clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	/**
	 * Calculates a foreground color (e.g., for text) that meets or exceeds the target
	 * WCAG contrast ratio against a given background color.
	 *
	 * @param bgColor The background color in OklchColor format.
	 * @param targetContrast The desired WCAG contrast ratio (e.g., 4.5 for AA, 7 for AAA).
	 * @returns An OklchColor for the foreground text.
	 */
	static getContrastingForegroundColor(bgColor: OklchColor, targetContrast: number): OklchColor {
		// Convert background to a culori object for calculations
		const culoriBg = { l: bgColor.l / 100, c: bgColor.c, h: bgColor.h, mode: "oklch" as const };
		const bgLuminance = wcagLuminance(oklchToRgb(culoriBg));

		// Define standard light and dark text colors. We use near-neutrals for readability.
		const lightText: OklchColor = { l: 98, c: 0.01, h: bgColor.h };
		const darkText: OklchColor = { l: 15, c: 0.02, h: bgColor.h };

		// Convert text colors to culori objects to get their luminance
		const culoriLightText = {
			l: lightText.l / 100,
			c: lightText.c,
			h: lightText.h,
			mode: "oklch" as const,
		};
		const lightLuminance = wcagLuminance(oklchToRgb(culoriLightText));

		const culoriDarkText = {
			l: darkText.l / 100,
			c: darkText.c,
			h: darkText.h,
			mode: "oklch" as const,
		};
		const darkLuminance = wcagLuminance(oklchToRgb(culoriDarkText));

		// Calculate contrast for both options
		const contrastWithLight = (lightLuminance + 0.05) / (bgLuminance + 0.05);
		const contrastWithDark = (bgLuminance + 0.05) / (darkLuminance + 0.05);

		// If the background is very dark, it's impossible for dark text to have contrast.
		// If the background is very light, it's impossible for light text to have contrast.
		// This logic handles all cases.
		if (contrastWithLight >= targetContrast && contrastWithLight > contrastWithDark) {
			return lightText;
		}

		if (contrastWithDark >= targetContrast && contrastWithDark > contrastWithLight) {
			return darkText;
		}

		// If neither meets the target, return the one with the HIGHEST contrast.
		// This ensures we always provide the most accessible option possible, even if it fails the target.
		return contrastWithLight > contrastWithDark ? lightText : darkText;
	}
}
