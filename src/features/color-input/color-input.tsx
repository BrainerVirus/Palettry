import React from "react";
import { useSignal } from "@preact/signals-react"; // Import useSignal for reactivity

// Import the primary color signal from your store
import { primaryColorSignal } from "@/features/palette-generation/store/palette-store";

const presets = [
	"oklch(49.6% 0.272 303.89)",
	"oklch(55% 0.22 25)",
	"oklch(60% 0.18 240)",
	"oklch(65% 0.15 140)",
];

// No `color` or `onColorChange` props are needed as it directly interacts with the signal
export default function ColorInput() {
	// Access the signal's value. This component will re-render whenever primaryColorSignal.value changes.
	const currentColor = useSignal(primaryColorSignal.value);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		primaryColorSignal.value = e.target.value; // Update the global signal
	};

	const handlePreset = (preset: string) => {
		primaryColorSignal.value = preset; // Update the global signal
	};

	return (
		<div className="space-y-4">
			<div>
				<label htmlFor="color-input" className="text-sm leading-none font-medium">
					Primary Color (OKLCH)
				</label>
				<input
					type="text"
					id="color-input"
					placeholder="oklch(49.6% 0.272 303.89)"
					value={currentColor.value} // Bind input value to the signal
					onChange={handleInput}
					className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				/>
			</div>
			<div className="grid grid-cols-4 gap-2">
				{presets.map((preset) => (
					<button
						key={preset} // `key` is essential for list rendering in React
						type="button"
						className="preset-color hover:border-ring h-8 rounded border-2 border-transparent"
						style={{ background: preset }}
						onClick={() => handlePreset(preset)}
					/>
				))}
			</div>
		</div>
	);
}
