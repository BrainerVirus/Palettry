import { vi, afterEach } from "vitest";

// Reset mocks/spies between tests to avoid leakage
afterEach(() => {
	vi.clearAllMocks();
	vi.resetModules();
});
