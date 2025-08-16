import { signal } from "@preact/signals-react"; // use @preact/signals-react for React components
import { GenerationMethods } from "@/features/palette-generation/lib/generation-methods";
import type { PaletteMethod } from "@/features/shared/types/global";

// Reactive signal for the primary color input
export const primaryColorSignal = signal<string>("oklch(49.6% 0.272 303.89)");

// Reactive signal for the generated methods (computed from primaryColorSignal)
export const generatedMethodsSignal = signal<PaletteMethod>();

// Function to update methods whenever primaryColorSignal changes
const updateGeneratedMethods = (newColor: string) => {
	try {
		generatedMethodsSignal.value = GenerationMethods.getAllMethods(newColor);
	} catch (error) {
		console.error("Error generating palettes from store:", error);
		generatedMethodsSignal.value = undefined; // Clear on error
	}
};

// Initialize methods when the store is loaded (for SSR hydration and initial client render)
updateGeneratedMethods(primaryColorSignal.value);

// Subscribe to changes in primaryColorSignal to re-generate methods.
// This effect runs whenever primaryColorSignal.value changes, causing `generatedMethodsSignal` to update,
// which in turn will trigger re-renders in any React components observing `generatedMethodsSignal`.
primaryColorSignal.subscribe((newColor) => {
	updateGeneratedMethods(newColor);
});

// You can optionally export a setter, but direct assignment `primaryColorSignal.value = ...` is also fine.
export const setPrimaryColor = (newColor: string) => {
	primaryColorSignal.value = newColor;
};
