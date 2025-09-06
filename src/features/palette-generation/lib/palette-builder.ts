import { clampChroma } from "culori";
import { ColorMath } from "@/features/palette-generation/lib/color-math";
import type { ColorShade, SemanticColors, Palette } from "@/features/shared/types/global";
import { SEMANTIC_HUE_CONSTRAINTS } from "@/features/palette-generation/constants/hue-constraints";
import {
	PRIMARY_COLORS_LIGHTNESS_PROGRESSION_MAP,
	NEUTRAL_COLORS_LIGHTNESS_PROGRESSION_MAP,
} from "@/features/palette-generation/constants/lightness-progression";

export class PaletteBuilder {
	static buildTonalScale(primaryColor: string): ColorShade[] {
		const { l: baseL, c: baseC, h: baseH } = ColorMath.parseOklch(primaryColor);
		// Use imported progression constant for stops and scales
		// PRIMARY_COLORS_LIGHTNESS_PROGRESSION_MAP: [{ scale, l }]
		const tonalScale: ColorShade[] = PRIMARY_COLORS_LIGHTNESS_PROGRESSION_MAP.map(
			({ scale, l }: { scale: string; l: number }) => {
				const currentL = baseL + l;
				// Chroma adjustment formula: Base_Chroma × (Current_Lightness / Base_Lightness)^0.7
				let adjustedChroma = baseC * Math.pow(currentL / baseL, 0.7);
				adjustedChroma = ColorMath.clamp(adjustedChroma, 0.005, 0.4);
				// For very light shades, reduce chroma further to avoid color cast
				if (currentL >= 90) adjustedChroma = 0.05;
				else if (currentL >= 80) adjustedChroma = 0.08;
				else if (currentL >= 70) adjustedChroma = 0.12;
				else if (currentL >= 60) adjustedChroma = 0.2;
				// For very dark, reduce chroma
				if (currentL <= 20) adjustedChroma = 0.08;
				else if (currentL <= 28) adjustedChroma = 0.14;
				// Clamp again
				adjustedChroma = ColorMath.clamp(adjustedChroma, 0.005, 0.4);
				return {
					scale: `primary-${scale}`,
					color: ColorMath.formatOklch(currentL, adjustedChroma, baseH),
					l: currentL,
					c: adjustedChroma,
					h: baseH,
					foreground: ColorMath.formatOklch(
						ColorMath.getContrastingForegroundColor(
							{ l: currentL, c: adjustedChroma, h: baseH },
							4.5
						).l,
						ColorMath.getContrastingForegroundColor(
							{ l: currentL, c: adjustedChroma, h: baseH },
							4.5
						).c,
						ColorMath.getContrastingForegroundColor(
							{ l: currentL, c: adjustedChroma, h: baseH },
							4.5
						).h
					),
				};
			}
		);
		return tonalScale;
	}

	static buildSemanticColors(primaryColor: string): SemanticColors {
		const { l: baseL, c: baseC } = ColorMath.parseOklch(primaryColor);
		const targetWeight = ColorMath.calculateWeight(baseL, baseC);
		const targetEnergy = ColorMath.calculateEnergy(baseL, baseC);

		const semanticColors: Partial<SemanticColors> = {};

		(
			Object.entries(SEMANTIC_HUE_CONSTRAINTS) as [
				keyof SemanticColors,
				(typeof SEMANTIC_HUE_CONSTRAINTS)[keyof typeof SEMANTIC_HUE_CONSTRAINTS],
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

			const targetContrast = 7.0; // AAA
			const foreground = ColorMath.getContrastingForegroundColor(finalColorOklch, targetContrast);

			semanticColors[name] = {
				color: finalColorString,
				foreground: ColorMath.formatOklch(foreground.l, foreground.c, foreground.h),
			};
		});

		return semanticColors as SemanticColors;
	}

	static buildNeutralScale(primaryColor: string): ColorShade[] {
		// Use imported progression constant for stops and scales
		// NEUTRAL_COLORS_LIGHTNESS_PROGRESSION_MAP: [{ scale, l }]
		const { h: baseH } = ColorMath.parseOklch(primaryColor);
		// Chroma stops as in make-colors.md
		const CHROMA_STOPS = [
			0.005, 0.008, 0.012, 0.018, 0.022, 0.025, 0.022, 0.018, 0.012, 0.008, 0.005,
		];
		const neutralScale: ColorShade[] = NEUTRAL_COLORS_LIGHTNESS_PROGRESSION_MAP.map(
			({ scale, l }: { scale: string; l: number }, i: number) => {
				const c = CHROMA_STOPS[i];
				return {
					scale: `neutral-${scale}`,
					color: ColorMath.formatOklch(l, c, baseH),
					l,
					c,
					h: baseH,
					foreground: ColorMath.formatOklch(
						ColorMath.getContrastingForegroundColor({ l, c, h: baseH }, 4.5).l,
						ColorMath.getContrastingForegroundColor({ l, c, h: baseH }, 4.5).c,
						ColorMath.getContrastingForegroundColor({ l, c, h: baseH }, 4.5).h
					),
				};
			}
		);
		return neutralScale;
	}

	static buildBaseScale(primaryColor: string): ColorShade[] {
		// Base colors with subtle primary color tint for brand cohesion and lighter scale
		const { h: baseH } = ColorMath.parseOklch(primaryColor);
		const baseColors = [
			{ scale: "base-50", l: 100, c: 0 }, // Pure white
			{ scale: "base-100", l: 99, c: 0.001 }, // Near white slight tint
			{ scale: "base-200", l: 98, c: 0.002 },
			{ scale: "base-300", l: 97, c: 0.004 },
			{ scale: "base-400", l: 94, c: 0.006 },
			{ scale: "base-500", l: 50, c: 0 }, // mid neutral
			{ scale: "base-600", l: 40, c: 0.005 },
			{ scale: "base-700", l: 30, c: 0.004 },
			{ scale: "base-800", l: 20, c: 0.003 },
			{ scale: "base-900", l: 10, c: 0.002 },
			{ scale: "base-950", l: 5, c: 0.001 },
		];

		return baseColors.map((shade) => ({
			scale: shade.scale,
			color: ColorMath.formatOklch(shade.l, shade.c, shade.c === 0 ? 0 : baseH), // Use primary hue for tinted bases
			l: shade.l,
			c: shade.c,
			h: shade.c === 0 ? 0 : baseH,
			foreground: ColorMath.formatOklch(
				ColorMath.getContrastingForegroundColor(
					{ l: shade.l, c: shade.c, h: shade.c === 0 ? 0 : baseH },
					4.5 // WCAG AA contrast
				).l,
				ColorMath.getContrastingForegroundColor(
					{ l: shade.l, c: shade.c, h: shade.c === 0 ? 0 : baseH },
					4.5
				).c,
				ColorMath.getContrastingForegroundColor(
					{ l: shade.l, c: shade.c, h: shade.c === 0 ? 0 : baseH },
					4.5
				).h
			),
		}));
	}

	static buildChartScale(primaryColor: string): ColorShade[] {
		const { h: baseH } = ColorMath.parseOklch(primaryColor);

		const hueOffsets = [30, 90, 180, 270, -30];
		const chartTone = { l: 72, c: 0.18 };

		const chartScale: ColorShade[] = hueOffsets.map((offset, index) => {
			const newHue = (baseH + offset + 360) % 360;

			const inGamut = clampChroma(
				{
					l: chartTone.l / 100,
					c: chartTone.c,
					h: newHue,
					mode: "oklch",
				},
				"oklch"
			);

			const finalL = inGamut.l * 100;
			const finalC = inGamut.c;
			const finalH = inGamut.h;

			return {
				scale: `chart-${index + 1}`,
				color: ColorMath.formatOklch(finalL, finalC, finalH),
				l: finalL,
				c: finalC,
				h: finalH,
				foreground: ColorMath.formatOklch(
					ColorMath.getContrastingForegroundColor({ l: finalL, c: finalC, h: finalH }, 4.5).l,
					ColorMath.getContrastingForegroundColor({ l: finalL, c: finalC, h: finalH }, 4.5).c,
					ColorMath.getContrastingForegroundColor({ l: finalL, c: finalC, h: finalH }, 4.5).h
				),
			};
		});

		return chartScale;
	}

	static buildPalette(primaryColor: string): Palette {
		try {
			const parsed = ColorMath.parseOklch(primaryColor);
			if (!ColorMath.validateOklch(parsed)) {
				throw new Error("Invalid color values.");
			}

			return {
				name: `Generated Palette`,
				description: `A complete color system derived from ${primaryColor}`,
				baseScale: this.buildBaseScale(primaryColor),
				tonalScale: this.buildTonalScale(primaryColor),
				semanticColors: this.buildSemanticColors(primaryColor),
				neutralScale: this.buildNeutralScale(primaryColor),
				chartScale: this.buildChartScale(primaryColor),
			};
		} catch (error) {
			console.error("Error building palette:", error);
			return {
				name: "Invalid Palette",
				description: `Failed to generate: ${(error as Error).message}`,
				baseScale: [
					{ scale: "base-50", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-100", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-200", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-300", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-400", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-500", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-600", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-700", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-800", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-900", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "base-950", color: "", l: 0, c: 0, h: 0, foreground: "" },
				],
				tonalScale: [
					{ scale: "primary-50", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-100", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-200", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-300", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-400", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-500", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-600", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-700", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-800", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-900", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "primary-950", color: "", l: 0, c: 0, h: 0, foreground: "" },
				],
				semanticColors: {
					success: { color: "", foreground: "" },
					warning: { color: "", foreground: "" },
					error: { color: "", foreground: "" },
					info: { color: "", foreground: "" },
				},
				neutralScale: [
					{ scale: "neutral-50", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-100", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-200", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-300", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-400", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-500", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-600", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-700", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-800", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-900", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "neutral-950", color: "", l: 0, c: 0, h: 0, foreground: "" },
				],
				chartScale: [
					{ scale: "chart-1", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "chart-2", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "chart-3", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "chart-4", color: "", l: 0, c: 0, h: 0, foreground: "" },
					{ scale: "chart-5", color: "", l: 0, c: 0, h: 0, foreground: "" },
				],
			};
		}
	}
}
