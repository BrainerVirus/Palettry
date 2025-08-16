import React from "react";
import { useSignals } from "@preact/signals-react/runtime"; // Import useSignals

import ColorInput from "@/features/color-input/color-input";
import PaletteDisplay from "@/features/palette-generation/palette-display";
import ExportPanel from "@/features/design-system-export/export-panel";

// Import your signals from the store
import { generatedMethodsSignal } from "@/features/palette-generation/store/palette-store";

export default function PaletteGeneratorApp() {
	// `useSignals()` hook ensures this component re-renders when any signal accessed within it changes.
	useSignals();

	// Access the current value of the generated methods signal
	const methods = generatedMethodsSignal.value;

	return (
		<>
			{/* Color Input (reads from primaryColorSignal) */}
			<ColorInput />

			{/* Generated Palettes (consumes methods from generatedMethodsSignal) */}
			<div id="palette-results" className="space-y-6">
				{methods && <PaletteDisplay method={methods} />}
			</div>

			{/* Export Panel (consumes methods from generatedMethodsSignal) */}
			<div id="export-section">
				<ExportPanel methods={methods} />
			</div>
		</>
	);
}
