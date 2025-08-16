import { ColorMath } from "@/features/palette-generation/lib/color-math";
import type { ColorShade, SemanticColors, PaletteMethod } from "@/features/shared/types/global";

import { HUE_CONSTRAINTS } from "@/features/palette-generation/constants/hue-constraints";
import { LIGHTNESS_PROGRESSION } from "@/features/palette-generation/constants/lightness-progression";
import { WCAG_CONSTRAINTS } from "@/features/palette-generation/constants/wcag-constraints";

export class GenerationMethods {
	/**
	 * Step 1: Generate tonal scale
	 */
	static generateTonalScale(primaryColor: string): ColorShade[] {
		const { l: baseL, c: baseC, h: baseH } = ColorMath.parseOklch(primaryColor);

		const tonalScale: ColorShade[] = LIGHTNESS_PROGRESSION.map(({ scale, l }) => {
			// Chroma adjustment formula: Base_Chroma × (Current_Lightness / Base_Lightness)^0.7
			const chromaFactor = Math.pow((baseL + l) / baseL, 0.7);
			const adjustedChroma = baseC * chromaFactor;
			const clampedChroma = ColorMath.clamp(adjustedChroma, 0.005, 0.4);

			return {
				scale: `primary-${scale}`,
				color: ColorMath.formatOklch(baseL + l, clampedChroma, baseH),
				l: baseL + l,
				c: clampedChroma,
				h: baseH,
			};
		});

		return tonalScale;
	}

	/**
	 * Step 2: Generate semantic status colors
	 */

	static generateSemanticStatusColors(primaryColor: string): SemanticColors {
		// Parse primary color
		const { l: baseL, c: baseC } = ColorMath.parseOklch(primaryColor);
		const targetWeight = ColorMath.calculateWeight(baseL, baseC);
		const targetEnergy = ColorMath.calculateEnergy(baseL, baseC);

		const semanticColors: Partial<SemanticColors> = {};

		(
			Object.entries(HUE_CONSTRAINTS) as [
				keyof SemanticColors,
				(typeof HUE_CONSTRAINTS)[keyof typeof HUE_CONSTRAINTS],
			][]
		).forEach(([name, constraints]) => {
			// Start with mid values
			let L = (constraints.l[0] + constraints.l[1]) / 2;
			let C = (constraints.c[0] + constraints.c[1]) / 2;

			// Try to match weight first, within constraints
			let weight = ColorMath.calculateWeight(L, C);
			if (weight < targetWeight * 0.85) {
				// Try increasing chroma if possible
				if (C < constraints.c[1]) {
					C = Math.min(constraints.c[1], targetWeight / (100 - L));
				}
				// If still not enough, try lowering L within constraints
				weight = ColorMath.calculateWeight(L, C);
				if (weight < targetWeight * 0.85 && L > constraints.l[0]) {
					L = Math.max(constraints.l[0], 100 - targetWeight / C);
				}
			}

			// Now try to match energy as well, within constraints
			let energy = ColorMath.calculateEnergy(L, C);
			if (energy < targetEnergy * 0.85) {
				// Try increasing chroma if possible
				if (C < constraints.c[1]) {
					C = Math.min(constraints.c[1], targetEnergy / Math.pow(L / 50, 0.5));
				}
				// If still not enough, try lowering L within constraints
				energy = ColorMath.calculateEnergy(L, C);
				if (energy < targetEnergy * 0.85 && L > constraints.l[0]) {
					L = Math.max(constraints.l[0], 50 * Math.pow(targetEnergy / C, 2));
				}
			}

			// Clamp values to constraints
			L = Math.max(constraints.l[0], Math.min(constraints.l[1], L));
			C = Math.max(constraints.c[0], Math.min(constraints.c[1], C));

			// Foreground: following WCAG
			const contrast = WCAG_CONSTRAINTS.find((c) => c.contrast === 7);
			if (contrast) {
				const finalColor = ColorMath.formatOklch(L, C, constraints.hue);
				const adjustedColor = ColorMath.adjustColor(ColorMath.parseOklch(finalColor), {
					contrast: contrast.contrast,
				});
				const { l, c, h } = adjustedColor;
				semanticColors[name] = {
					color: finalColor,
					foreground: ColorMath.formatOklch(l, c, h),
				};
			}
		});

		return semanticColors as SemanticColors;
	}

	/**
	 * Step 3: Generate neural scale
	 */
	static generateNeutralScale(primaryColor: string): ColorShade[] {
		console.log("[generateNeutralScale] Input primaryColor:", primaryColor);
		const { c: baseC, h: baseH } = ColorMath.parseOklch(primaryColor);
		console.log("[generateNeutralScale] Parsed baseC:", baseC, "baseH:", baseH);

		// Use very low chroma (0.005-0.03)
		const neutralChroma = ColorMath.clamp(baseC * 0.1, 0.005, 0.03);
		console.log("[generateNeutralScale] Calculated neutralChroma:", neutralChroma);

		// Use standard lightness progression
		const lightnesses = LIGHTNESS_PROGRESSION.map(({ scale, l }) => {
			const color = ColorMath.formatOklch(l, neutralChroma, baseH);
			console.log(`[generateNeutralScale] scale: neutral-${scale}, l: ${l}, color: ${color}`);
			return {
				scale: `neutral-${scale}`,
				color,
				l,
				c: neutralChroma,
				h: baseH,
			};
		});

		console.log("[generateNeutralScale] Generated neutral scale:", lightnesses);
		return lightnesses;
	}

	/**
	 * Generate all palette methods for a primary color
	 */
	static getAllMethods(primaryColor: string): PaletteMethod {
		try {
			// Validate input color
			const parsed = ColorMath.parseOklch(primaryColor);
			if (!ColorMath.validateOklch(parsed)) {
				throw new Error("Invalid color values");
			}

			return {
				name: `palette-${primaryColor}`,
				description: `Color palette generated from primary color ${primaryColor}`,
				tonalScale: this.generateTonalScale(primaryColor),
				semanticColors: this.generateSemanticStatusColors(primaryColor),
				neutralScale: this.generateNeutralScale(primaryColor),
			};
		} catch (error) {
			console.error("Error generating palette methods:", error);
			return {
				name: "invalid-palette",
				description: "Color palette generation failed",
				tonalScale: [],
				semanticColors: {
					success: { color: "", foreground: "" },
					warning: { color: "", foreground: "" },
					error: { color: "", foreground: "" },
					info: { color: "", foreground: "" },
				},
				neutralScale: [],
			};
		}
	}
}
