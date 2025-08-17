import React from "react";

import ColorInput from "@/features/color-input/components/color-input";
import PaletteDisplay from "@/features/palette-generation/components/palette-display";
import ExportPanel from "@/features/design-system-export/components/export-panel";

// Import your signals from the store
import { palette } from "@/features/palette-generation/store/palette-store";
import { useSignals } from "@preact/signals-react/runtime";

export default function PaletteGeneratorApp() {
	useSignals();
	return (
		<>
			{/* Color Input (reads from primaryColorSignal) */}
			<ColorInput />

			{/* Generated Palettes (consumes methods from generatedMethodsSignal) */}
			<div id="palette-results" className="space-y-6">
				<PaletteDisplay palette={palette.value} />
			</div>

			{/* Export Panel (consumes methods from generatedMethodsSignal) */}
			<div id="export-section">
				<ExportPanel palette={palette.value} />
			</div>
		</>
	);
}
