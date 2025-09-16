import { describe, it, expect } from "vitest";
import { PRESETS } from "./color-presets";
import { ColorMath } from "@/features/palette-generation/lib/color-math";

describe("color-presets", () => {
	it("all presets are valid OKLCH strings parsable by ColorMath", () => {
		for (const s of PRESETS) {
			const parsed = ColorMath.parseOklch(s);
			expect(parsed.l).toBeGreaterThanOrEqual(0);
			expect(parsed.l).toBeLessThanOrEqual(100);
		}
	});
});
