import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ColorInput } from "./color-input";
import * as store from "@/features/palette-generation/store/palette-store";

// Helper to advance timers for debounce-driven effects
function advanceDebounce(ms = 600) {
	vi.advanceTimersByTime(ms);
}

describe("ColorInput component", () => {
	it("renders current brand color and preview block", () => {
		render(<ColorInput />);
		// Label-driven query
		const input = screen.getByLabelText(/oklch/i) as HTMLInputElement;
		expect(input.value).toMatch(/^oklch\(/i);

		// Preview block renders with accessible title equal to raw value
		const preview = screen.getByTitle(input.value);
		expect(preview).toBeInTheDocument();
	});

	it("formats valid OKLCH value on blur", () => {
		render(<ColorInput />);
		const input = screen.getByLabelText(/oklch/i) as HTMLInputElement;

		// Enter a valid value with rough formatting
		fireEvent.change(input, { target: { value: "oklch(60% 0.18 240)" } });
		// onBlur reformats and clears error
		fireEvent.blur(input);
		expect(input.value).toMatch(/^oklch\(\d{1,3}\.\d%\s+\d\.\d{3}\s+\d{1,3}\.\d{2}\)/);
	});

	it("shows error message for invalid raw value after debounce", () => {
		vi.useFakeTimers();
		render(<ColorInput />);
		const input = screen.getByLabelText(/oklch/i) as HTMLInputElement;

		fireEvent.change(input, { target: { value: "not-a-color" } });

		// Debounced effect will set error after 500ms
		act(() => {
			advanceDebounce();
		});

		expect(screen.getByText(/expected: oklch\(60% 0\.18 240\)/i)).toBeInTheDocument();

		vi.useRealTimers();
	});

	it("pushes formatted color to store on valid change", () => {
		vi.useFakeTimers();
		const setBrandColorSpy = vi.spyOn(store, "setBrandColor");
		render(<ColorInput />);
		const input = screen.getByLabelText(/oklch/i) as HTMLInputElement;

		fireEvent.change(input, { target: { value: "oklch(61% 0.2 250)" } });
		// wait for debounce to push
		act(() => {
			advanceDebounce();
		});
		expect(setBrandColorSpy).toHaveBeenCalled();
		vi.useRealTimers();
	});
});
