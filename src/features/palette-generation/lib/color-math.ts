// features/palette-generation/lib/color-math.ts
import type { OklchColor } from "@/features/shared/types/global";
import { WCAG_CONSTRAINTS } from "@/features/palette-generation/constants/wcag-constraints";

export class ColorMath {
	/**
	 * Parse OKLCH string into components
	 */
	static parseOklch(oklchString: string): OklchColor {
		const match = oklchString.match(/oklch\((.+?)%\s+(.+?)\s+(.+?)\)/);
		if (!match) {
			throw new Error(`Invalid OKLCH format: ${oklchString}`);
		}

		return {
			l: parseFloat(match[1]),
			c: parseFloat(match[2]),
			h: parseFloat(match[3]),
		};
	}

	/**
	 * Format OKLCH components into string
	 */
	static formatOklch(l: number, c: number, h: number): string {
		return `oklch(${l.toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(2)})`;
	}

	/**
	 * Calculate perceptual weight of a color
	 */
	static calculateWeight(l: number, c: number): number {
		return (100 - l) * c;
	}

	/**
	 * Calculate energy level of a color
	 */
	static calculateEnergy(l: number, c: number, baseL: number = 50): number {
		return c * Math.pow(l / baseL, 0.5);
	}

	/**
	 * Adjust chroma based on lightness change
	 */
	static adjustChroma(baseC: number, currentL: number, baseL: number): number {
		return baseC * Math.pow(currentL / baseL, 0.7);
	}

	/**
	 * Validate OKLCH color values
	 */
	static validateOklch(color: OklchColor): boolean {
		return (
			color.l >= 0 &&
			color.l <= 100 &&
			color.c >= 0 &&
			color.c <= 0.5 &&
			color.h >= 0 &&
			color.h <= 360
		);
	}

	/**
	 * Clamp value between min and max
	 */
	static clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	/**
	 * Get hue from OKLCH color
	 */
	static getHue(color: OklchColor): number {
		return color.h;
	}

	/**
	 * Get chroma from OKLCH color
	 */
	static getChroma(color: OklchColor): number {
		return color.c;
	}

	static getLightness(color: OklchColor): number {
		return color.l;
	}

	/**
	 * Adjust color based on contrast requirements
	 */
	static adjustColor(color: OklchColor, options: { contrast: number }): OklchColor {
		const { contrast } = options;

		// Find the appropriate WCAG constraint
		const constraint = WCAG_CONSTRAINTS.find((c) => c.contrast === contrast);
		if (!constraint) {
			throw new Error(`No WCAG constraint found for contrast: ${contrast}`);
		}

		// Adjust color based on the constraint
		// (This is a simplified example; real adjustment logic would be more complex)
		color.l = Math.min(100, color.l + 10);
		color.c = Math.min(0.5, color.c + 0.1);

		return color;
	}
}
