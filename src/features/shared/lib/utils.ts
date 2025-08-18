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
