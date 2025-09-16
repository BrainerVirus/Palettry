import { describe, it, expect } from "vitest";
import {
	generateHueGradient,
	generateLightnessGradient,
	generateChromaGradient,
	getPreviewColors,
} from "./color-input-utils";
import { clamp } from "@/core/palette/utils/clamp";
import { normalizeHue } from "@/core/palette/utils/hue";

// Collocated unit tests for color-input utils

describe("color-input utils", () => {
	it("clamp keeps value within bounds", () => {
		expect(clamp(5, 0, 10)).toBe(5);
		expect(clamp(-1, 0, 10)).toBe(0);
		expect(clamp(11, 0, 10)).toBe(10);
	});

	it("normalizeHue wraps around 0..360 with special-case 360", () => {
		expect(normalizeHue(370)).toBe(10);
		expect(normalizeHue(-30)).toBe(330);
		expect(normalizeHue(360)).toBe(360);
	});

	it("generateHueGradient returns a valid linear-gradient string", () => {
		const g = generateHueGradient(50, 0.2);
		expect(g.startsWith("linear-gradient(")).toBe(true);
		expect(g.includes("oklch(")).toBe(true);
	});

	it("generateLightnessGradient returns a valid linear-gradient string", () => {
		const g = generateLightnessGradient(0.2, 300);
		expect(g.includes("oklch(0%")).toBe(true);
		expect(g.includes("oklch(100%")).toBe(true);
	});

	it("generateChromaGradient returns a valid linear-gradient string", () => {
		const g = generateChromaGradient(60, 200, 0.3);
		expect(g.includes("oklch(60% 0 200)")).toBe(true);
		expect(g.includes("oklch(60% 0.3 200)")).toBe(true);
	});

	it("getPreviewColors returns bg/fg even when ColorMath throws", () => {
		const res = getPreviewColors(
			NaN as unknown as number,
			NaN as unknown as number,
			NaN as unknown as number
		);
		expect(res).toHaveProperty("bg");
		expect(res).toHaveProperty("fg");
	});
});
