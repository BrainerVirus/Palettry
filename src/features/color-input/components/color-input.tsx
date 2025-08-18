import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { primaryColor, setPrimaryColor } from "@/features/palette-generation/store/palette-store";
import { ColorMath } from "@/features/palette-generation/lib/color-math";
import { Card } from "@/features/shared/components/card";
import { Button } from "@/features/shared/components/button";
import { Input } from "@/features/shared/components/input";
import { Label } from "@/features/shared/components/label";
import { Slider } from "@/features/shared/components/slider";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const formatOKLCH = (l: number, c: number, h: number) => ColorMath.formatOklch(l, c, h);

const L_MIN = 0;
const L_MAX = 100;
const C_MIN = 0;
const C_MAX = 0.4; // UI bound; downstream handles gamut
const H_MIN = 0;
const H_MAX = 360;

function PresetSwatch({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
	const fg = useMemo(() => {
		try {
			const p = ColorMath.parseOklch(value);
			const f = ColorMath.getContrastingForegroundColor(p, 7.0);
			return formatOKLCH(f.l, f.c, f.h);
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

export default function ColorInput() {
	useSignals();

	const [l, setL] = useState<number>(60);
	const [c, setC] = useState<number>(0.18);
	const [h, setH] = useState<number>(240);
	const [raw, setRaw] = useState<string>("oklch(60% 0.18 240)");
	const [error, setError] = useState<string | null>(null);

	// Sync local UI when signal changes externally (e.g., presets elsewhere)
	useEffect(() => {
		try {
			const parsed = ColorMath.parseOklch(primaryColor.value);
			setL(parsed.l);
			setC(parsed.c);
			setH(parsed.h);
			setRaw(formatOKLCH(parsed.l, parsed.c, parsed.h));
			setError(null);
		} catch {
			setError("Invalid OKLCH in store");
		}
	}, [primaryColor.value]);

	// Debounce push to the signal for smoother slider UX
	const debounceId = useRef<number | null>(null);
	const pushToSignal = (nextL: number, nextC: number, nextH: number) => {
		const formatted = formatOKLCH(nextL, nextC, nextH);
		setRaw(formatted);
		if (debounceId.current) window.clearTimeout(debounceId.current);
		debounceId.current = window.setTimeout(() => {
			setPrimaryColor(formatted);
		}, 80);
	};

	const onLChange = (val: number) => {
		const v = clamp(val, L_MIN, L_MAX);
		setL(v);
		setError(null);
		pushToSignal(v, c, h);
	};

	const onCChange = (val: number) => {
		const v = clamp(val, C_MIN, C_MAX);
		setC(v);
		setError(null);
		pushToSignal(l, v, h);
	};

	const onHChange = (val: number) => {
		let v = val % 360;
		if (v < 0) v += 360;
		v = clamp(v, H_MIN, H_MAX);
		setH(v);
		setError(null);
		pushToSignal(l, c, v);
	};

	const onRawChange = (s: string) => {
		setRaw(s);
		try {
			const parsed = ColorMath.parseOklch(s.trim());
			const nextL = clamp(parsed.l, L_MIN, L_MAX);
			const nextC = clamp(parsed.c, C_MIN, C_MAX);
			const nextH = clamp(parsed.h, H_MIN, H_MAX);
			setL(nextL);
			setC(nextC);
			setH(nextH);
			setError(null);
			pushToSignal(nextL, nextC, nextH);
		} catch {
			setError("Expected: oklch(60% 0.18 240)");
		}
	};

	const onRawBlur = () => {
		try {
			const parsed = ColorMath.parseOklch(raw.trim());
			const formatted = formatOKLCH(parsed.l, parsed.c, parsed.h);
			setRaw(formatted);
			setError(null);
		} catch {
			// keep user input to allow fixing
		}
	};

	const preview = useMemo(() => {
		try {
			const color = { l, c, h };
			const fg = ColorMath.getContrastingForegroundColor(color, 7.0);
			return {
				bg: formatOKLCH(l, c, h),
				fg: formatOKLCH(fg.l, fg.c, fg.h),
			};
		} catch {
			return { bg: "transparent", fg: "currentColor" };
		}
	}, [l, c, h]);

	const presets = [
		"oklch(49.6% 0.272 303.89)",
		"oklch(55% 0.22 25)",
		"oklch(60% 0.18 240)",
		"oklch(72% 0.16 140)",
	];

	const applyPreset = (s: string) => {
		try {
			const p = ColorMath.parseOklch(s);
			setL(p.l);
			setC(p.c);
			setH(p.h);
			setRaw(formatOKLCH(p.l, p.c, p.h));
			setError(null);
			setPrimaryColor(formatOKLCH(p.l, p.c, p.h));
		} catch {
			setError("Invalid preset");
		}
	};

	return (
		<Card>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<h3 className="text-lg font-semibold">Primary color</h3>
						<p className="text-muted-foreground text-sm">
							Type OKLCH or use the sliders. We’ll keep it valid and in sync.
						</p>
					</div>
					<div
						className="flex h-10 min-w-24 items-center justify-center rounded border px-3 font-mono text-sm"
						style={{ background: preview.bg, color: preview.fg }}
						title={raw}
					>
						Aa
					</div>
				</div>

				{/* Raw OKLCH string */}
				<div className="space-y-2">
					<Label htmlFor="oklch">OKLCH</Label>
					<Input
						id="oklch"
						value={raw}
						onChange={(e) => onRawChange(e.target.value)}
						onBlur={onRawBlur}
						placeholder="oklch(60% 0.18 240)"
						className={`font-mono text-sm ${error ? "border-red-500" : ""}`}
						autoComplete="off"
						spellCheck={false}
					/>
					{error ? (
						<div className="text-xs text-red-500">{error}</div>
					) : (
						<div className="text-muted-foreground text-xs">
							Format: oklch(L% C H) — L 0–100, C 0–0.4, H 0–360
						</div>
					)}
				</div>

				{/* Sliders + numeric inputs */}
				<div className="grid gap-4 md:grid-cols-3">
					{/* Lightness */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label htmlFor="l">L (Lightness)</Label>
							<Input
								id="l"
								type="number"
								min={L_MIN}
								max={L_MAX}
								step={0.1}
								value={l}
								onChange={(e) => onLChange(parseFloat(e.target.value))}
								className="w-24 text-right"
							/>
						</div>
						<Slider
							value={[l]}
							min={L_MIN}
							max={L_MAX}
							step={0.1}
							onValueChange={([v]) => onLChange(v)}
						/>
					</div>

					{/* Chroma */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label htmlFor="c">C (Chroma)</Label>
							<Input
								id="c"
								type="number"
								min={C_MIN}
								max={C_MAX}
								step={0.001}
								value={c}
								onChange={(e) => onCChange(parseFloat(e.target.value))}
								className="w-24 text-right"
							/>
						</div>
						<Slider
							value={[c]}
							min={C_MIN}
							max={C_MAX}
							step={0.001}
							onValueChange={([v]) => onCChange(v)}
						/>
					</div>

					{/* Hue */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label htmlFor="h">H (Hue)</Label>
							<Input
								id="h"
								type="number"
								min={H_MIN}
								max={H_MAX}
								step={0.1}
								value={h}
								onChange={(e) => onHChange(parseFloat(e.target.value))}
								className="w-24 text-right"
							/>
						</div>
						<Slider
							value={[h]}
							min={H_MIN}
							max={H_MAX}
							step={0.1}
							onValueChange={([v]) => onHChange(v)}
						/>
					</div>
				</div>

				{/* Presets as color swatches */}
				<div className="flex flex-wrap gap-2">
					{presets.map((p) => (
						<PresetSwatch key={p} value={p} onSelect={applyPreset} />
					))}
					<Button
						size="sm"
						variant="outline"
						onClick={() => applyPreset("oklch(49.6% 0.272 303.89)")}
					>
						Reset
					</Button>
				</div>
			</div>
		</Card>
	);
}
