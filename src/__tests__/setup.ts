import { vi, afterEach, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Reset mocks/spies between tests to avoid leakage
afterEach(() => {
	vi.clearAllMocks();
	vi.resetModules();
});

// Extend DOM matchers
expect.extend(matchers);
