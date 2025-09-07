import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function $<T extends Element = Element>(selector: string): T | null {
	return document.querySelector(selector) as T | null;
}

export function $$<T extends Element = Element>(selector: string): NodeListOf<T> {
	return document.querySelectorAll(selector) as NodeListOf<T>;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export function normalizeHue(hue: number): number {
	let normalized = hue % 360;
	if (normalized < 0) normalized += 360;
	// Special case: if the result is exactly 0 but the original was 360, keep it as 360
	if (normalized === 0 && hue === 360) return 360;
	return normalized;
}

export function debounce<T extends (...args: unknown[]) => void>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}
