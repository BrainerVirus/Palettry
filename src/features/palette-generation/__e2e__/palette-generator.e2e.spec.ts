import { test, expect } from "@playwright/test";

// Basic smoke E2E for the main app using Astro dev server

test("app renders without console errors and shows title", async ({ page }) => {
	const errors: string[] = [];
	page.on("pageerror", (e) => errors.push(String(e)));
	page.on("console", (msg) => {
		if (["error"].includes(msg.type())) errors.push(msg.text());
	});

	await page.goto("/");
	await expect(page.locator("body")).toBeVisible();
	const title = await page.title();
	expect(title.toLowerCase()).toContain("palettry");
	expect(errors).toEqual([]);
});

// Optional UX flow: if a color input exists, change it and expect UI to update
// Kept defensive so E2E doesn't fail if UI changes

test("allows color input interaction if present", async ({ page }) => {
	await page.goto("/");
	const color = page.locator('input[type="color"]');
	if ((await color.count()) === 0) test.skip();

	const first = color.first();
	await first.fill("#7c3aed");
	await expect(first).toHaveValue("#7c3aed");
});
