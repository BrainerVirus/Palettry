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
