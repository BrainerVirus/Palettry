import { ColorMath } from "@/features/palette-generation/lib/color-math";
import { clamp, normalizeHue } from "@/features/shared/lib/utils";

export { clamp };
export const formatOKLCH = (l: number, c: number, h: number) => ColorMath.formatOklch(l, c, h);

export const getPreviewColors = (l: number, c: number, h: number) => {
	try {
		const color = { l, c, h };
		const fg = ColorMath.getContrastingForegroundColor(color, 7.0);
		return {
			bg: formatOKLCH(l, c, h),
			fg: formatOKLCH(fg.l, fg.c, fg.h),
		};
	} catch {
		return { bg: "transparent", fg: "currentColor" };
	}
};

export { normalizeHue };

// Generate OKLCH gradient for Hue slider (0-360°, fixed L and C)
export function generateHueGradient(currentL: number, currentC: number): string {
	const stops = [];
	for (let h = 0; h <= 360; h += 36) {
		// 10 stops for smoothness
		stops.push(`oklch(${currentL}% ${currentC} ${h})`);
	}
	return `linear-gradient(to right, ${stops.join(", ")})`;
}

// Generate OKLCH gradient for Lightness slider (0-100%, fixed C and H)
export function generateLightnessGradient(currentC: number, currentH: number): string {
	return `linear-gradient(to right, oklch(0% ${currentC} ${currentH}), oklch(100% ${currentC} ${currentH}))`;
}

// Generate OKLCH gradient for Chroma slider (0-max, fixed L and H)
export function generateChromaGradient(
	currentL: number,
	currentH: number,
	maxC: number = 0.4
): string {
	return `linear-gradient(to right, oklch(${currentL}% 0 ${currentH}), oklch(${currentL}% ${maxC} ${currentH}))`;
}
