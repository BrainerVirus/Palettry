import { ColorMath } from "@/features/palette-generation/lib/color-math";
import type { ColorShade, SemanticColors, PaletteMethod } from "@/features/shared/types/global";
import { HUE_CONSTRAINTS } from "@/features/palette-generation/constants/hue-constraints";
import { LIGHTNESS_PROGRESSION } from "@/features/palette-generation/constants/lightness-progression";
import { clampChroma } from "culori";

export class GenerationMethods {
	static generateTonalScale(primaryColor: string): ColorShade[] {
		const { l: baseL, c: baseC, h: baseH } = ColorMath.parseOklch(primaryColor);

		const tonalScale: ColorShade[] = LIGHTNESS_PROGRESSION.map(({ scale, l: lightnessOffset }) => {
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
		});

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
		const neutralChroma = ColorMath.clamp(baseC * 0.1, 0.005, 0.03);
		const neutralLightnesses = [98, 95, 88, 78, 65, 52, 42, 32, 22, 15, 8];
		const scaleNames = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

		const neutralScale: ColorShade[] = neutralLightnesses.map((l, index) => {
			const color = ColorMath.formatOklch(l, neutralChroma, baseH);
			return {
				scale: `neutral-${scaleNames[index]}`,
				color,
				l,
				c: neutralChroma,
				h: baseH,
			};
		});
		return neutralScale;
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
			};
		} catch (error) {
			console.error("Error generating palette:", error);
			return {
				name: "Invalid Palette",
				description: `Failed to generate: ${(error as Error).message}`,
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
