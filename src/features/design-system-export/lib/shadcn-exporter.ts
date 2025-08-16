import type { PaletteMethod, ColorShade } from "@/features/shared/types/global";

type CssVars = Record<string, string>;

type Parsed = { lPct: number; c: number; h: number };

// Parse ok: "oklch(49.6% 0.272 303.89)" or "oklch(0.496 0.272 303.89)"
const parseOklch = (ok: string): Parsed | null => {
	const m = ok.match(/oklch\(\s*([0-9.]+)(%?)\s+([0-9.]+)\s+([0-9.]+)\s*\)/i);
	if (!m) return null;
	const l = parseFloat(m[1]);
	const isPct = m[2] === "%";
	return { lPct: isPct ? l : l * 100, c: parseFloat(m[3]), h: parseFloat(m[4]) };
};

// Format as full OKLCH string with lightness in 0–1 decimals like your theme
const formatFull = (p: Parsed): string => {
	const L = (p.lPct / 100).toFixed(3); // 49.6% -> 0.496
	const C = p.c.toFixed(3);
	const H = p.h.toFixed(3);
	return `oklch(${L} ${C} ${H})`;
};

const normalizeFull = (ok: string, fallback: string): string => {
	const parsed = parseOklch(ok) ?? parseOklch(fallback);
	return parsed ? formatFull(parsed) : fallback;
};

const shadeFull = (scale: string, shades: ColorShade[], fallback: string): string => {
	const found = shades.find((s) => s.scale === scale)?.color;
	return normalizeFull(found ?? fallback, fallback);
};

export class ShadcnExporter {
	private static lightVars(method: PaletteMethod): CssVars {
		const t = method.tonalScale;

		return {
			"--radius": "0.5rem",

			"--background": "oklch(1 0 0)", // white
			"--foreground": shadeFull("950", t, "oklch(0.120 0.010 0)"),

			"--card": "oklch(1 0 0)",
			"--card-foreground": shadeFull("950", t, "oklch(0.120 0.010 0)"),

			"--popover": "oklch(1 0 0)",
			"--popover-foreground": shadeFull("950", t, "oklch(0.120 0.010 0)"),

			"--primary": shadeFull("500", t, "oklch(0.500 0.200 300)"),
			"--primary-foreground": shadeFull("50", t, "oklch(0.980 0.000 0)"),

			// neutral-ish UI tones derived from your scale
			"--secondary": shadeFull("200", t, "oklch(0.880 0.010 300)"),
			"--secondary-foreground": shadeFull("800", t, "oklch(0.220 0.010 300)"),

			"--muted": shadeFull("200", t, "oklch(0.880 0.010 300)"),
			"--muted-foreground": shadeFull("600", t, "oklch(0.420 0.020 300)"),

			"--accent": shadeFull("200", t, "oklch(0.880 0.010 300)"),
			"--accent-foreground": shadeFull("800", t, "oklch(0.220 0.010 300)"),

			"--destructive": normalizeFull(method.semanticColors.error.color, "oklch(0.575 0.215 25)"),
			"--destructive-foreground": normalizeFull(
				method.semanticColors.error.foreground,
				"oklch(0.980 0.020 25)"
			),

			"--border": shadeFull("300", t, "oklch(0.780 0.015 300)"),
			"--input": shadeFull("300", t, "oklch(0.780 0.015 300)"),
			"--ring": shadeFull("500", t, "oklch(0.500 0.200 300)"),
		};
	}

	private static darkVars(method: PaletteMethod): CssVars {
		const t = method.tonalScale;

		return {
			"--background": shadeFull("950", t, "oklch(0.080 0.005 300)"),
			"--foreground": shadeFull("50", t, "oklch(0.980 0.000 0)"),

			"--card": shadeFull("900", t, "oklch(0.150 0.008 300)"),
			"--card-foreground": shadeFull("50", t, "oklch(0.980 0.000 0)"),

			"--popover": shadeFull("900", t, "oklch(0.150 0.008 300)"),
			"--popover-foreground": shadeFull("50", t, "oklch(0.980 0.000 0)"),

			"--primary": shadeFull("500", t, "oklch(0.500 0.200 300)"),
			"--primary-foreground": shadeFull("900", t, "oklch(0.150 0.008 300)"),

			"--secondary": shadeFull("800", t, "oklch(0.220 0.010 300)"),
			"--secondary-foreground": shadeFull("50", t, "oklch(0.980 0.000 0)"),

			"--muted": shadeFull("800", t, "oklch(0.220 0.010 300)"),
			"--muted-foreground": shadeFull("400", t, "oklch(0.650 0.020 300)"),

			"--accent": shadeFull("800", t, "oklch(0.220 0.010 300)"),
			"--accent-foreground": shadeFull("50", t, "oklch(0.980 0.000 0)"),

			"--destructive": normalizeFull(method.semanticColors.error.color, "oklch(0.575 0.215 25)"),
			"--destructive-foreground": normalizeFull(
				method.semanticColors.error.foreground,
				"oklch(0.980 0.020 25)"
			),

			"--border": shadeFull("700", t, "oklch(0.320 0.015 300)"),
			"--input": shadeFull("700", t, "oklch(0.320 0.015 300)"),
			"--ring": shadeFull("400", t, "oklch(0.650 0.020 300)"),
		};
	}

	private static format(vars: CssVars, selector: string): string {
		const lines = Object.entries(vars)
			.map(([k, v]) => `    ${k}: ${v};`)
			.join("\n");
		return `  ${selector} {\n${lines}\n  }`;
	}

	static generateCSS(method: PaletteMethod): string {
		const light = this.format(this.lightVars(method), ":root");
		const dark = this.format(this.darkVars(method), ".dark");
		// IMPORTANT: use var(--token) directly, not oklch(var(--token))
		return `@layer base {
${light}

${dark}
}`;
	}
}
