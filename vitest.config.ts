import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/__tests__/setup.ts",
		css: false,
		include: ["**/*.test.{ts,tsx,js,jsx}"],
		exclude: [
			"**/__e2e__/**",
			"**/*.e2e.*",
			"tests/**",
			"node_modules",
			"dist",
			"playwright-report",
			"test-results",
		],
	},
});
