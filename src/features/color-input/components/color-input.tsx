import React, { useMemo, useRef } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { primaryColor, setPrimaryColor } from "@/features/palette-generation/store/palette-store";
import { signal } from "@preact/signals-react";
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

const lSignal = signal<number>(60);
const cSignal = signal<number>(0.18);
const hSignal = signal<number>(240);
const rawSignal = signal<string>("oklch(60% 0.18 240)");
const errorSignal = signal<string | null>(null);

export default function ColorInput() {
	useSignals();

	// One-time initialization from current primaryColor
	const initRef = useRef(false);
	if (!initRef.current) {
		try {
			const parsed = ColorMath.parseOklch(primaryColor.value);
			lSignal.value = parsed.l;
			cSignal.value = parsed.c;
			hSignal.value = parsed.h;
			rawSignal.value = formatOKLCH(parsed.l, parsed.c, parsed.h);
			errorSignal.value = null;
		} catch {
			// keep defaults
		}
		initRef.current = true;
	}

	// Immediate commit helper
	const pushToSignal = (nextL: number, nextC: number, nextH: number) => {
		const formatted = formatOKLCH(nextL, nextC, nextH);
		rawSignal.value = formatted;
		setPrimaryColor(formatted);
	};

	// Real-time palette sync while dragging (throttled to rAF)
	const liveFrame = useRef<number | null>(null);
	const scheduleLivePrimarySync = () => {
		if (liveFrame.current) cancelAnimationFrame(liveFrame.current);
		liveFrame.current = requestAnimationFrame(() => {
			pushToSignal(lSignal.value, cSignal.value, hSignal.value);
		});
	};

	// Live updates + commit (both trigger schedule)
	const onLChangeLive = (val: number) => {
		lSignal.value = clamp(val, L_MIN, L_MAX);
		errorSignal.value = null;
		scheduleLivePrimarySync();
	};
	const onCChangeLive = (val: number) => {
		cSignal.value = clamp(val, C_MIN, C_MAX);
		errorSignal.value = null;
		scheduleLivePrimarySync();
	};
	const onHChangeLive = (val: number) => {
		let v = val % 360;
		if (v < 0) v += 360;
		hSignal.value = clamp(v, H_MIN, H_MAX);
		errorSignal.value = null;
		scheduleLivePrimarySync();
	};
	// Commit handlers ensure final exact value applied immediately
	const onLCommit = (val: number) =>
		pushToSignal(clamp(val, L_MIN, L_MAX), cSignal.value, hSignal.value);
	const onCCommit = (val: number) =>
		pushToSignal(lSignal.value, clamp(val, C_MIN, C_MAX), hSignal.value);
	const onHCommit = (val: number) => {
		let v = val % 360;
		if (v < 0) v += 360;
		pushToSignal(lSignal.value, cSignal.value, clamp(v, H_MIN, H_MAX));
	};

	const onRawChange = (s: string) => {
		rawSignal.value = s;
		try {
			const parsed = ColorMath.parseOklch(s.trim());
			const nextL = clamp(parsed.l, L_MIN, L_MAX);
			const nextC = clamp(parsed.c, C_MIN, C_MAX);
			const nextH = clamp(parsed.h, H_MIN, H_MAX);
			lSignal.value = nextL;
			cSignal.value = nextC;
			hSignal.value = nextH;
			errorSignal.value = null;
			pushToSignal(nextL, nextC, nextH);
		} catch {
			errorSignal.value = "Expected: oklch(60% 0.18 240)";
		}
	};

	const onRawBlur = () => {
		try {
			const parsed = ColorMath.parseOklch(rawSignal.value.trim());
			const formatted = formatOKLCH(parsed.l, parsed.c, parsed.h);
			rawSignal.value = formatted;
			errorSignal.value = null;
		} catch {
			// ignore formatting errors; user input retained for correction
		}
	};

	const preview = useMemo(() => {
		try {
			const color = { l: lSignal.value, c: cSignal.value, h: hSignal.value };
			const fg = ColorMath.getContrastingForegroundColor(color, 7.0);
			return {
				bg: formatOKLCH(lSignal.value, cSignal.value, hSignal.value),
				fg: formatOKLCH(fg.l, fg.c, fg.h),
			};
		} catch {
			return { bg: "transparent", fg: "currentColor" };
		}
	}, [lSignal.value, cSignal.value, hSignal.value]);

	const presets = [
		"oklch(49.6% 0.272 303.89)",
		"oklch(55% 0.22 25)",
		"oklch(60% 0.18 240)",
		"oklch(72% 0.16 140)",
	];

	const applyPreset = (s: string) => {
		try {
			const p = ColorMath.parseOklch(s);
			lSignal.value = p.l;
			cSignal.value = p.c;
			hSignal.value = p.h;
			rawSignal.value = formatOKLCH(p.l, p.c, p.h);
			errorSignal.value = null;
			setPrimaryColor(formatOKLCH(p.l, p.c, p.h));
		} catch {
			errorSignal.value = "Invalid preset";
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
						title={rawSignal.value}
					>
						Aa
					</div>
				</div>

				{/* Raw OKLCH string */}
				<div className="space-y-2">
					<Label htmlFor="oklch">OKLCH</Label>
					<Input
						id="oklch"
						value={rawSignal.value}
						onChange={(e) => onRawChange(e.target.value)}
						onBlur={onRawBlur}
						placeholder="oklch(60% 0.18 240)"
						className={`font-mono text-sm ${errorSignal.value ? "border-red-500" : ""}`}
						autoComplete="off"
						spellCheck={false}
					/>
					{errorSignal.value ? (
						<div className="text-xs text-red-500">{errorSignal.value}</div>
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
								value={lSignal.value}
								onChange={(e) => {
									const v = parseFloat(e.target.value);
									onLChangeLive(v);
									onLCommit(v);
								}}
								className="w-24 text-right"
							/>
						</div>
						<Slider
							value={[lSignal.value]}
							min={L_MIN}
							max={L_MAX}
							step={0.1}
							onValueChange={([v]) => onLChangeLive(v)}
							onValueCommit={([v]) => onLCommit(v)}
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
								value={cSignal.value}
								onChange={(e) => {
									const v = parseFloat(e.target.value);
									onCChangeLive(v);
									onCCommit(v);
								}}
								className="w-24 text-right"
							/>
						</div>
						<Slider
							value={[cSignal.value]}
							min={C_MIN}
							max={C_MAX}
							step={0.001}
							onValueChange={([v]) => onCChangeLive(v)}
							onValueCommit={([v]) => onCCommit(v)}
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
								value={hSignal.value}
								onChange={(e) => {
									const v = parseFloat(e.target.value);
									onHChangeLive(v);
									onHCommit(v);
								}}
								className="w-24 text-right"
							/>
						</div>
						<Slider
							value={[hSignal.value]}
							min={H_MIN}
							max={H_MAX}
							step={0.1}
							onValueChange={([v]) => onHChangeLive(v)}
							onValueCommit={([v]) => onHCommit(v)}
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
