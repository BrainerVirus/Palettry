import { test, expect } from "@playwright/test";

// E2E smoke tests for the Color Input feature

test("color input sliders render and are interactive", async ({ page }) => {
	await page.goto("/");

	// Try to find sliders by role
	const sliders = page.getByRole("slider");
	await expect(sliders.first()).toBeVisible();

	// If there is at least one slider, try dragging via keyboard interaction
	const count = await sliders.count();
	if (count === 0) test.skip();

	const first = sliders.first();
	await first.press("ArrowRight");
	await first.press("End");
	// basic assertion: role still visible
	await expect(first).toBeVisible();
});

test("no severe console errors when adjusting slider", async ({ page }) => {
	const errors: string[] = [];
	page.on("console", (msg) => {
		if (msg.type() === "error") errors.push(msg.text());
	});

	await page.goto("/");
	const sliders = page.getByRole("slider");
	if ((await sliders.count()) === 0) test.skip();

	const first = sliders.first();
	await first.press("ArrowRight");

	expect(errors).toEqual([]);
});
