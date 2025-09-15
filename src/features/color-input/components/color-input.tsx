import React, { useMemo, useRef } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { brandColor, setBrandColor } from "@/features/palette-generation/store/palette-store";
import { effect, signal } from "@preact/signals-react";
import { ColorMath } from "@/features/palette-generation/lib/color-math";
import { Card } from "@/features/shared/components/card";
// import { Button } from "@/features/shared/components/button";
import { Input } from "@/features/shared/components/input";
import { Label } from "@/features/shared/components/label";
import { ColorSlider } from "./color-slider";
// import PresetSwatch from "@/features/shared/components/preset-swatch";
import {
	L_MIN,
	L_MAX,
	C_MIN,
	C_MAX,
	H_MIN,
	H_MAX,
} from "@/features/shared/constants/color-constraints";
// import { PRESETS } from "@/features/color-input/constants/color-presets";
import { formatOKLCH, getPreviewColors } from "@/features/color-input/lib/color-input-utils";
import { clamp } from "@/features/shared/lib/utils";

const lSignal = signal<number>(60);
const cSignal = signal<number>(0.18);
const hSignal = signal<number>(240);
const rawSignal = signal<string>("oklch(60% 0.18 240)");
const errorSignal = signal<string | null>(null);

export default function ColorInput() {
	useSignals();

	// Debounced validation using effect
	effect(() => {
		const input = rawSignal.value;
		const timeoutId = setTimeout(() => {
			try {
				const parsed = ColorMath.parseOklch(input.trim());
				const nextL = clamp(parsed.l, L_MIN, L_MAX);
				const nextC = clamp(parsed.c, C_MIN, C_MAX);
				const nextH = Math.max(H_MIN, Math.min(H_MAX, parsed.h));
				lSignal.value = nextL;
				cSignal.value = nextC;
				hSignal.value = nextH;
				errorSignal.value = null;
				pushToSignal(nextL, nextC, nextH);
			} catch {
				errorSignal.value = "Expected: oklch(60% 0.18 240)";
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	});

	// One-time initialization from current brandColor
	const initRef = useRef(false);
	if (!initRef.current) {
		try {
			const parsed = ColorMath.parseOklch(brandColor.value);
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
		setBrandColor(formatted);
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
		// For hue slider, we want to clamp to 0-360 range without wrapping
		// Since hue is circular, but for UX we want it to stop at 360
		const clampedHue = Math.max(H_MIN, Math.min(H_MAX, val));
		hSignal.value = clampedHue;
		errorSignal.value = null;
		scheduleLivePrimarySync();
	};

	// Commit handlers ensure final exact value applied immediately
	const onLCommit = (val: number) =>
		pushToSignal(clamp(val, L_MIN, L_MAX), cSignal.value, hSignal.value);
	const onCCommit = (val: number) =>
		pushToSignal(lSignal.value, clamp(val, C_MIN, C_MAX), hSignal.value);
	const onHCommit = (val: number) => {
		const clampedHue = Math.max(H_MIN, Math.min(H_MAX, val));
		pushToSignal(lSignal.value, cSignal.value, clampedHue);
	};

	const onRawChange = (s: string) => {
		rawSignal.value = s;
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

	const preview = useMemo(
		() => getPreviewColors(lSignal.value, cSignal.value, hSignal.value),
		[lSignal.value, cSignal.value, hSignal.value]
	);

	// const applyPreset = (s: string) => {
	// 	try {
	// 		const p = ColorMath.parseOklch(s);
	// 		lSignal.value = p.l;
	// 		cSignal.value = p.c;
	// 		hSignal.value = p.h;
	// 		rawSignal.value = formatOKLCH(p.l, p.c, p.h);
	// 		errorSignal.value = null;
	// 		setPrimaryColor(formatOKLCH(p.l, p.c, p.h));
	// 	} catch {
	// 		errorSignal.value = "Invalid preset";
	// 	}
	// };

	return (
		<Card>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<h3 className="text-lg font-semibold">Brand color</h3>
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
				<div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4">
					{/* Lightness */}
					<div className="space-y-3">
						<Label htmlFor="l">L (Lightness)</Label>
						<div className="grid w-full grid-cols-1 gap-2 md:grid-cols-[minmax(8rem,6fr)_minmax(4rem,1fr)]">
							<ColorSlider
								type="lightness"
								value={lSignal.value}
								min={L_MIN}
								max={L_MAX}
								step={0.1}
								onValueChange={([v]) => onLChangeLive(v)}
								onValueCommit={([v]) => onLCommit(v)}
								currentC={cSignal.value}
								currentH={hSignal.value}
								aria-label={`Lightness: ${lSignal.value.toFixed(1)}%`}
							/>
							<Input
								id="l"
								min={L_MIN}
								max={L_MAX}
								step={0.1}
								value={lSignal.value}
								onChange={(e) => {
									const v = parseFloat(e.target.value);
									onLChangeLive(v);
									onLCommit(v);
								}}
								className="w-full text-center"
							/>
						</div>
					</div>

					{/* Chroma */}
					<div className="space-y-3">
						<Label htmlFor="c">C (Chroma)</Label>
						<div className="grid w-full grid-cols-1 gap-2 md:grid-cols-[minmax(8rem,6fr)_minmax(4rem,1fr)]">
							<ColorSlider
								type="chroma"
								value={cSignal.value}
								min={C_MIN}
								max={C_MAX}
								step={0.001}
								onValueChange={([v]) => onCChangeLive(v)}
								onValueCommit={([v]) => onCCommit(v)}
								currentL={lSignal.value}
								currentH={hSignal.value}
								aria-label={`Chroma: ${cSignal.value.toFixed(3)}`}
							/>
							<Input
								id="c"
								min={C_MIN}
								max={C_MAX}
								step={0.001}
								value={cSignal.value}
								onChange={(e) => {
									const v = parseFloat(e.target.value);
									onCChangeLive(v);
									onCCommit(v);
								}}
								className="w-full text-center"
							/>
						</div>
					</div>

					{/* Hue */}
					<div className="space-y-3">
						<Label htmlFor="h">H (Hue)</Label>
						<div className="grid w-full grid-cols-1 gap-2 md:grid-cols-[minmax(8rem,6fr)_minmax(4rem,1fr)]">
							<ColorSlider
								type="hue"
								value={hSignal.value}
								min={H_MIN}
								max={H_MAX}
								step={0.1}
								onValueChange={([v]) => onHChangeLive(v)}
								onValueCommit={([v]) => onHCommit(v)}
								currentL={lSignal.value}
								currentC={cSignal.value}
								aria-label={`Hue: ${hSignal.value.toFixed(1)}°`}
							/>
							<Input
								id="h"
								min={H_MIN}
								max={H_MAX}
								step={0.1}
								value={hSignal.value}
								onChange={(e) => {
									const v = parseFloat(e.target.value);
									onHChangeLive(v);
									onHCommit(v);
								}}
								className="w-full text-center"
							/>
						</div>
					</div>
				</div>

				{/* Presets as color swatches */}
				{/* <div className="flex flex-wrap gap-2">
					{PRESETS.map((p) => (
						<PresetSwatch key={p} value={p} onSelect={applyPreset} />
					))}
					<Button
						size="sm"
						variant="outline"
						onClick={() => applyPreset("oklch(49.6% 0.272 303.89)")}
					>
						Reset
					</Button>
				</div> */}
			</div>
		</Card>
	);
}
