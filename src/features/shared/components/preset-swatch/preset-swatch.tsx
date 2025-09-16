import React, { useMemo } from "react";
import { ColorMath } from "@/core/palette/color-math";
import { Button } from "@/features/shared/components/button";
import type { PresetSwatchProps } from "@/features/color-input/types";

export function PresetSwatch({ value, onSelect }: PresetSwatchProps) {
	const fg = useMemo(() => {
		try {
			const p = ColorMath.parseOklch(value);
			const f = ColorMath.getContrastingForegroundColor(p, 7.0);
			return ColorMath.formatOklch(f.l, f.c, f.h);
		} catch {
			return "black";
		}
	}, [value]);

	return (
		<Button
			type="button"
			variant="outline"
			onClick={() => onSelect(value)}
			title={value}
			aria-label={`Preset ${value}`}
			className="hover:ring-ring h-9 min-w-[11rem] justify-center border font-mono text-xs transition-all hover:ring-2"
			style={{ background: value, color: fg }}
		>
			{value}
		</Button>
	);
}
