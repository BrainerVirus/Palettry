import { describe, it, expect } from "vitest";
import { ColorMath } from "./color-math";
import { clamp } from "@/core/palette/utils/clamp";

describe("ColorMath", () => {
	it("parses and formats OKLCH consistently", () => {
		const parsed = ColorMath.parseOklch("oklch(42% 0.242 303.89)");
		expect(parsed.l).toBeCloseTo(42, 1);
		expect(parsed.c).toBeCloseTo(0.242, 3);
		expect(parsed.h).toBeCloseTo(303.89, 2);

		const formatted = ColorMath.formatOklch(parsed.l, parsed.c, parsed.h);
		expect(formatted.startsWith("oklch(")).toBe(true);
		expect(/oklch\(\d{1,3}\.\d%\s+\d\.\d{3}\s+\d{1,3}\.\d{2}\)/.test(formatted)).toBe(true);
	});

	it("clamps values within ranges (utility)", () => {
		expect(clamp(200, 0, 100)).toBe(100);
		expect(clamp(-10, 0, 100)).toBe(0);
		expect(clamp(50, 0, 100)).toBe(50);
	});

	it("returns a contrasting foreground (light or dark)", () => {
		const bg = { l: 95, c: 0.02, h: 300 };
		const fg = ColorMath.getContrastingForegroundColor(bg, 4.5);
		expect(typeof fg.l).toBe("number");
		expect(typeof fg.c).toBe("number");
		expect(typeof fg.h).toBe("number");
	});
});
