import { describe, it, expect } from "vitest";
import { ShadcnExporter } from ".";
import { buildFakePalette } from "@/__tests__/helpers/fake-palette";

describe("ShadcnExporter.generateTailwindV4CSS", () => {
	it("produces :root and .dark blocks with chart variables", () => {
		const css = ShadcnExporter.generateTailwindV4CSS(buildFakePalette());
		expect(css).toMatch(/:root\s*{/);
		expect(css).toMatch(/\.dark\s*{/);
		// Should include at least one chart var
		expect(css).toMatch(/--chart-1:/);
	});
});
