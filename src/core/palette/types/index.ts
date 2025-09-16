// Domain color + palette types (inlined; no re-export indirection)

export interface OklchColor {
	l: number;
	c: number;
	h: number;
}

export interface ColorShade {
	scale: string;
	color: string;
	l: number;
	c: number;
	h: number;
	foreground?: string;
}

export interface SemanticColorSet {
	color: string;
	foreground: string;
}

export interface SemanticColors {
	success: SemanticColorSet;
	warning: SemanticColorSet;
	error: SemanticColorSet;
	info: SemanticColorSet;
}

export interface Palette {
	name: string;
	description: string;
	baseScale: ColorShade[];
	tonalScale: ColorShade[];
	semanticColors: SemanticColors;
	neutralScale: ColorShade[];
	chartScale: ColorShade[];
}

export interface HueConstraint {
	hue: number;
	l: [number, number];
	c: [number, number];
}

export interface SemanticHueConstraints {
	success: HueConstraint;
	warning: HueConstraint;
	error: HueConstraint;
	info: HueConstraint;
}

export interface LightnessProgression {
	scale: string;
	l: number;
}

export * from "./lightness"; // (LightnessProgression) retained for local separation if extended later
