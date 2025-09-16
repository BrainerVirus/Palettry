import { describe, it, expect } from "vitest";
import { TailwindV4Exporter } from ".";
import { buildFakePalette } from "@/__tests__/helpers/fake-palette";

describe("TailwindV4Exporter.generateTailwindV4CSS", () => {
	it("contains @theme inline and :root block", () => {
		const css = TailwindV4Exporter.generateTailwindV4CSS(buildFakePalette());
		expect(css).toMatch(/@theme inline/);
		expect(css).toMatch(/:root\s*{/);
	});
});
