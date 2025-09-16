import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	// Collocate E2E specs next to features using __e2e__ convention
	testDir: "./src",
	testMatch: ["**/__e2e__/**/*.e2e.spec.{ts,tsx,js,jsx}"],
	timeout: 30_000,
	expect: { timeout: 5_000 },
	retries: process.env.CI ? 2 : 0,
	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:4321",
		trace: "on-first-retry",
	},
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:4321",
		reuseExistingServer: !process.env.CI,
		stdout: "ignore",
		stderr: "pipe",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
