export interface ColorInputState {
	l: number;
	c: number;
	h: number;
	raw: string;
	error: string | null;
}

export interface PresetSwatchProps {
	value: string;
	onSelect: (value: string) => void;
}
