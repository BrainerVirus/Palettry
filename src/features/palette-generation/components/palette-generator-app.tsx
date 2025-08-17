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
		<div className="grid gap-5">
			<ColorInput />
			<PaletteDisplay palette={palette.value} />
			<ExportPanel palette={palette.value} />
		</div>
	);
}
