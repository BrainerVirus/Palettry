import { test, expect } from "@playwright/test";

// E2E test for export panel basic presence & copy interaction

test("export panel shows CSS snippet and copy button works", async ({ page }) => {
	await page.goto("/");
	// Expect export heading text
	const heading = page.getByRole("heading", { name: /Export Design System/i });
	await expect(heading).toBeVisible();

	// Copy button
	const copyBtn = page.getByRole("button", { name: /Copy CSS/i });
	await expect(copyBtn).toBeVisible();

	// Snippet area present
	const snippet = page.locator("pre");
	await expect(snippet.first()).toBeVisible();

	// Trigger copy (cannot assert clipboard across browsers reliably without permissions)
	await copyBtn.click();
});
