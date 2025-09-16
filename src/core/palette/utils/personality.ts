export interface PersonalityMetrics {
	weight: number;
	energy: number;
	saturationLevel: "low" | "medium" | "high";
}

/**
 * Centralized perceptual personality metrics for OKLCH values.
 * L expected in [0,100], C in [0,0.5].
 */
export function computePersonality(L: number, C: number): PersonalityMetrics {
	const weight = (100 - L) * C; // darker & more chroma => heavier
	const energy = C * Math.sqrt(L / 50); // brighter + chroma => energetic
	const saturationLevel = C > 0.2 ? "high" : C > 0.1 ? "medium" : "low";
	return { weight, energy, saturationLevel };
}
