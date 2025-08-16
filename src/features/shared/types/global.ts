// src/types/global.ts
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

export interface PaletteMethod {
	name: string;
	description: string;
	tonalScale: ColorShade[];
	semanticColors: SemanticColors;
	neutralScale: ColorShade[];
}

export interface HueConstraint {
	hue: number;
	l: [number, number];
	c: [number, number];
}

export interface HueConstraints {
	success: HueConstraint;
	warning: HueConstraint;
	error: HueConstraint;
	info: HueConstraint;
}
