import React from "react";
import { primaryColor } from "@/features/palette-generation/store/palette-store";

const presets = [
	"oklch(49.6% 0.272 303.89)",
	"oklch(55% 0.22 25)",
	"oklch(60% 0.18 240)",
	"oklch(65% 0.15 140)",
];

export default function ColorInput() {
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		primaryColor.value = e.target.value;
	};

	const handlePreset = (preset: string) => {
		primaryColor.value = preset;
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
					value={primaryColor.value}
					onChange={handleInput}
					className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				/>
			</div>
			<div className="grid grid-cols-4 gap-2">
				{presets.map((preset) => (
					<button
						key={preset}
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
