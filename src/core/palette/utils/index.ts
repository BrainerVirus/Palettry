export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Normalize a hue angle to 0..360 while preserving an explicit 360 input (not wrapping to 0).
 */
export function normalizeHue(hue: number): number {
	let normalized = hue % 360;
	if (normalized < 0) normalized += 360;
	if (normalized === 0 && hue === 360) return 360;
	return normalized;
}
