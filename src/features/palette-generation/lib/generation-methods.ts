import { ColorMath } from "@/features/palette-generation/lib/color-math";
import type { ColorShade, SemanticColors, PaletteMethod } from "@/features/shared/types/global";
import { HUE_CONSTRAINTS } from "@/features/palette-generation/constants/hue-constraints";
import {
	PRIMARY_COLORS_LIGHTNESS_PROGRESSION_MAP,
	NEUTRAL_COLORS_LIGHTNESS_PROGRESSION_MAP,
} from "@/features/palette-generation/constants/lightness-progression";
import { clampChroma } from "culori";

export class GenerationMethods {
	static generateTonalScale(primaryColor: string): ColorShade[] {
		const { l: baseL, c: baseC, h: baseH } = ColorMath.parseOklch(primaryColor);

		const tonalScale: ColorShade[] = PRIMARY_COLORS_LIGHTNESS_PROGRESSION_MAP.map(
			({ scale, l: lightnessOffset }) => {
				const currentL = ColorMath.clamp(baseL + lightnessOffset, 0, 100);
				let adjustedChroma;

				if (currentL === 0 || baseL === 0) {
					adjustedChroma = 0.005;
				} else if (currentL === baseL) {
					adjustedChroma = baseC;
				} else {
					adjustedChroma = baseC * Math.pow(currentL / baseL, 0.7);
				}

				const inGamutChroma = clampChroma(
					{ l: currentL / 100, c: adjustedChroma, h: baseH, mode: "oklch" },
					"oklch"
				).c;

				return {
					scale: `primary-${scale}`,
					color: ColorMath.formatOklch(currentL, inGamutChroma, baseH),
					l: currentL,
					c: inGamutChroma,
					h: baseH,
				};
			}
		);

		return tonalScale;
	}

	static generateSemanticColors(primaryColor: string): SemanticColors {
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
			let L = (constraints.l[0] + constraints.l[1]) / 2;
			let C = (constraints.c[0] + constraints.c[1]) / 2;

			for (let i = 0; i < 5; i++) {
				const currentWeight = ColorMath.calculateWeight(L, C);
				const currentEnergy = ColorMath.calculateEnergy(L, C);
				if (currentWeight < targetWeight * 0.9) {
					L = Math.max(constraints.l[0], L - 5);
					C = Math.min(constraints.c[1], C * 1.1);
				} else if (currentWeight > targetWeight * 1.1) {
					L = Math.min(constraints.l[1], L + 5);
					C = Math.max(constraints.c[0], C * 0.9);
				}
				if (currentEnergy < targetEnergy * 0.9) {
					C = Math.min(constraints.c[1], C * 1.05);
				} else if (currentEnergy > targetEnergy * 1.1) {
					C = Math.max(constraints.c[0], C * 0.95);
				}
				L = ColorMath.clamp(L, constraints.l[0], constraints.l[1]);
				C = ColorMath.clamp(C, constraints.c[0], constraints.c[1]);
			}

			const inGamutColor = clampChroma(
				{ l: L / 100, c: C, h: constraints.hue, mode: "oklch" },
				"oklch"
			);
			const finalL = inGamutColor.l * 100;
			const finalC = inGamutColor.c;
			const finalH = inGamutColor.h;

			const finalColorOklch = { l: finalL, c: finalC, h: finalH };
			const finalColorString = ColorMath.formatOklch(finalL, finalC, finalH);

			// Use the new, robust function to get the foreground color
			const foregroundContrastTarget = 7.0; // Target AAA
			const foregroundColor = ColorMath.getContrastingForegroundColor(
				finalColorOklch,
				foregroundContrastTarget
			);

			semanticColors[name] = {
				color: finalColorString,
				foreground: ColorMath.formatOklch(foregroundColor.l, foregroundColor.c, foregroundColor.h),
			};
		});

		return semanticColors as SemanticColors;
	}
	static generateNeutralScale(primaryColor: string): ColorShade[] {
		const { c: baseC, h: baseH } = ColorMath.parseOklch(primaryColor);
		// Increase the lightness and reduce chroma for a whiter, softer neutral
		const neutralChroma = ColorMath.clamp(baseC * 0.06, 0.002, 0.018);

		const neutralScale: ColorShade[] = NEUTRAL_COLORS_LIGHTNESS_PROGRESSION_MAP.map(
			({ scale, l }) => {
				// For base 50, force white using oklch
				if (Number(scale) === 50) {
					return {
						scale: `neutral-${scale}`,
						color: ColorMath.formatOklch(100, 0, 0), // oklch(100% 0 0)
						l: 100,
						c: 0,
						h: 0,
					};
				}
				// Slightly boost lightness for extra whiteness
				const adjustedL = Math.min(l + 4, 100);
				const color = ColorMath.formatOklch(adjustedL, neutralChroma, baseH);
				return {
					scale: `neutral-${scale}`,
					color,
					l: adjustedL,
					c: neutralChroma,
					h: baseH,
				};
			}
		);
		return neutralScale;
	}

	static generateChartScale(primaryColor: string): ColorShade[] {
		const { h: baseH } = ColorMath.parseOklch(primaryColor);

		// Use a Tetradic color scheme for high visual distinction
		const hueOffsets = [30, 90, 180, 270, -30];
		const personality = { l: 72, c: 0.18 }; // A good versatile personality for charts

		const chartScale: ColorShade[] = hueOffsets.map((offset, index) => {
			const newHue = (baseH + offset + 360) % 360; // Ensure hue is always positive

			// Ensure the generated color is within the sRGB gamut
			const inGamutColor = clampChroma(
				{
					l: personality.l / 100,
					c: personality.c,
					h: newHue,
					mode: "oklch",
				},
				"oklch"
			);

			const finalL = inGamutColor.l * 100;
			const finalC = inGamutColor.c;
			const finalH = inGamutColor.h;

			return {
				scale: `chart-${index + 1}`,
				color: ColorMath.formatOklch(finalL, finalC, finalH),
				l: finalL,
				c: finalC,
				h: finalH,
			};
		});

		return chartScale;
	}

	static getAllMethods(primaryColor: string): PaletteMethod {
		try {
			const parsed = ColorMath.parseOklch(primaryColor);
			if (!ColorMath.validateOklch(parsed)) {
				throw new Error("Invalid color values.");
			}
			return {
				name: `Generated Palette for ${primaryColor}`,
				description: `A complete color system derived from ${primaryColor}`,
				tonalScale: this.generateTonalScale(primaryColor),
				semanticColors: this.generateSemanticColors(primaryColor),
				neutralScale: this.generateNeutralScale(primaryColor),
				chartScale: this.generateChartScale(primaryColor),
			};
		} catch (error) {
			console.error("Error generating palette:", error);
			return {
				name: "Invalid Palette",
				description: `Failed to generate: ${(error as Error).message}`,
				tonalScale: [
					{ scale: "primary-50", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-100", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-200", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-300", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-400", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-500", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-600", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-700", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-800", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-900", color: "", l: 0, c: 0, h: 0 },
					{ scale: "primary-950", color: "", l: 0, c: 0, h: 0 },
				],
				semanticColors: {
					success: { color: "", foreground: "" },
					warning: { color: "", foreground: "" },
					error: { color: "", foreground: "" },
					info: { color: "", foreground: "" },
				},
				neutralScale: [
					{ scale: "neutral-50", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-100", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-200", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-300", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-400", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-500", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-600", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-700", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-800", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-900", color: "", l: 0, c: 0, h: 0 },
					{ scale: "neutral-950", color: "", l: 0, c: 0, h: 0 },
				],
				chartScale: [
					{ scale: "chart-1", color: "", l: 0, c: 0, h: 0 },
					{ scale: "chart-2", color: "", l: 0, c: 0, h: 0 },
					{ scale: "chart-3", color: "", l: 0, c: 0, h: 0 },
					{ scale: "chart-4", color: "", l: 0, c: 0, h: 0 },
					{ scale: "chart-5", color: "", l: 0, c: 0, h: 0 },
				],
			};
		}
	}
}
