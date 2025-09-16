import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ColorSlider } from "./color-slider";

// Basic mock for cn if needed (but it’s imported from shared utils in real code)

describe("ColorSlider", () => {
	const baseProps = {
		value: 50,
		min: 0,
		max: 100,
		step: 1,
		onValueChange: vi.fn(),
		onValueCommit: vi.fn(),
	};

	it("renders with role=slider and accessible attributes", () => {
		render(
			<ColorSlider
				type="hue"
				aria-label="Hue"
				currentL={60}
				currentC={0.18}
				currentH={240}
				{...baseProps}
			/>
		);

		const slider = screen.getByRole("slider", { name: /hue/i });
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveAttribute("aria-valuemin", "0");
		expect(slider).toHaveAttribute("aria-valuemax", "100");
		expect(slider).toHaveAttribute("aria-valuenow", "50");
	});

	it("applies hue gradient background", () => {
		const { getByRole } = render(<ColorSlider type="hue" aria-label="Hue" {...baseProps} />);

		const slider = getByRole("slider");
		const style = (slider as HTMLElement).getAttribute("style") || "";
		expect(style.includes("linear-gradient(")).toBe(true);
	});

	it("responds to keyboard arrows and commits on key interaction", () => {
		const onValueChange = vi.fn();
		const onValueCommit = vi.fn();

		render(
			<ColorSlider
				type="lightness"
				aria-label="Lightness"
				value={50}
				min={0}
				max={100}
				step={1}
				onValueChange={onValueChange}
				onValueCommit={onValueCommit}
			/>
		);

		const slider = screen.getByRole("slider", { name: /lightness/i });
		slider.focus();
		fireEvent.keyDown(slider, { key: "ArrowRight" });
		expect(onValueChange).toHaveBeenCalled();
		// A commit is triggered on key handling once value stabilizes
		// This will vary with implementation; we assert it eventually happens
		fireEvent.keyDown(slider, { key: "End" });
		expect(onValueCommit).toHaveBeenCalled();
	});
});
