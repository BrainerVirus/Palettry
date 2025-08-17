import type { Palette, ColorShade } from "@/features/shared/types/global";
import { ColorMath } from "@/features/palette-generation/lib/color-math";
import { clampChroma } from "culori";

type CssVars = Record<string, string>;

// --- Helper Functions ---

// Parses "oklch(L% C H)" or "oklch(L C H)" and returns a full "oklch(L C H)" string
// with L as a 0-1 decimal, matching the shadcn/ui theme format.
const normalizeFull = (oklchStr: string, fallback: string): string => {
	const match = oklchStr.match(/oklch\(\s*([0-9.]+)(%?)\s+([0-9.]+)\s+([0-9.]+)\s*\)/i);
	if (!match) return fallback;

	const l = parseFloat(match[1]);
	const isPct = match[2] === "%";
	const lDecimal = isPct ? l / 100 : l;

	return `oklch(${lDecimal.toFixed(3)} ${parseFloat(match[3]).toFixed(3)} ${parseFloat(match[4]).toFixed(3)})`;
};

// Finds a shade from a scale and returns its normalized color string.
const findAndNormalize = (
	scaleName: string,
	tonalScale: ColorShade[],
	neutralScale: ColorShade[],
	fallback: string
): string => {
	const found =
		tonalScale.find((s) => s.scale === scaleName) ||
		neutralScale.find((s) => s.scale === scaleName);
	return normalizeFull(found?.color ?? fallback, fallback);
};

// Generates a set of 5 distinct and vibrant chart colors.
const generateChartColors = (primaryHue: number): { light: CssVars; dark: CssVars } => {
	const hues = [
		(primaryHue + 30) % 360,
		(primaryHue + 90) % 360,
		(primaryHue + 180) % 360,
		(primaryHue + 270) % 360,
		(primaryHue - 30) % 360,
	];
	const lightModePersonality = { l: 70, c: 0.15 };
	const darkModePersonality = { l: 75, c: 0.2 };

	const light = hues.reduce((acc, h, i) => {
		const inGamut = clampChroma(
			{ l: lightModePersonality.l / 100, c: lightModePersonality.c, h, mode: "oklch" },
			"oklch"
		);
		acc[`--chart-${i + 1}`] = normalizeFull(
			ColorMath.formatOklch(inGamut.l * 100, inGamut.c, inGamut.h),
			"oklch(0.7 0.15 0)"
		);
		return acc;
	}, {} as CssVars);

	const dark = hues.reduce((acc, h, i) => {
		const inGamut = clampChroma(
			{ l: darkModePersonality.l / 100, c: darkModePersonality.c, h, mode: "oklch" },
			"oklch"
		);
		acc[`--chart-${i + 1}`] = normalizeFull(
			ColorMath.formatOklch(inGamut.l * 100, inGamut.c, inGamut.h),
			"oklch(0.75 0.20 0)"
		);
		return acc;
	}, {} as CssVars);

	return { light, dark };
};

export class ShadcnExporter {
	private static lightVars(method: Palette): CssVars {
		const { tonalScale, neutralScale, semanticColors } = method;
		const primary500 = tonalScale.find((s) => s.scale === "primary-500");
		const primaryColor = ColorMath.parseOklch(primary500?.color || "oklch(50% 0 0)");
		const chartColors = generateChartColors(primaryColor.h);

		const primaryForeground = ColorMath.getContrastingForegroundColor(primaryColor, 10);

		return {
			"--radius": "0.625rem",

			// Layer 1: Page
			"--background": findAndNormalize("neutral-50", tonalScale, neutralScale, "oklch(0.985 0 0)"),
			"--foreground": findAndNormalize("neutral-900", tonalScale, neutralScale, "oklch(0.205 0 0)"),

			// Layer 2: Cards & Popovers (very close to background)
			"--card": findAndNormalize("neutral-50", tonalScale, neutralScale, "oklch(0.985 0 0)"),
			"--card-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.205 0 0)"
			),
			"--popover": findAndNormalize("neutral-50", tonalScale, neutralScale, "oklch(0.985 0 0)"),
			"--popover-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.205 0 0)"
			),

			// Primary
			"--primary": normalizeFull(
				primary500?.color || "oklch(0.496 0.272 303.89)",
				"oklch(0.496 0.272 303.89)"
			),
			"--primary-foreground": normalizeFull(
				ColorMath.formatOklch(primaryForeground.l, primaryForeground.c, primaryForeground.h),
				"oklch(0.985 0 0)"
			),

			// Layer 3: Secondary/Muted/Accent (subtle fills)
			"--secondary": findAndNormalize("neutral-100", tonalScale, neutralScale, "oklch(0.970 0 0)"),
			"--secondary-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.205 0 0)"
			),
			"--muted": findAndNormalize("neutral-100", tonalScale, neutralScale, "oklch(0.970 0 0)"),
			"--muted-foreground": findAndNormalize(
				"neutral-600",
				tonalScale,
				neutralScale,
				"oklch(0.556 0 0)"
			),
			"--accent": findAndNormalize("neutral-100", tonalScale, neutralScale, "oklch(0.970 0 0)"),
			"--accent-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.205 0 0)"
			),

			// Destructive
			"--destructive": normalizeFull(semanticColors.error.color, "oklch(0.577 0.245 27.325)"),
			"--destructive-foreground": normalizeFull(
				semanticColors.error.foreground,
				"oklch(0.98 0.02 25)"
			),

			// Layer 4: Borders/Inputs/Ring
			"--border": findAndNormalize("neutral-200", tonalScale, neutralScale, "oklch(0.920 0 0)"),
			"--input": findAndNormalize("neutral-200", tonalScale, neutralScale, "oklch(0.920 0 0)"),
			"--ring": findAndNormalize("primary-400", tonalScale, neutralScale, "oklch(0.708 0 0)"),

			// Sidebar (slightly darker than page to separate)
			"--sidebar": findAndNormalize("neutral-100", tonalScale, neutralScale, "oklch(0.970 0 0)"),
			"--sidebar-foreground": findAndNormalize(
				"neutral-900",
				tonalScale,
				neutralScale,
				"oklch(0.205 0 0)"
			),
			"--sidebar-border": findAndNormalize(
				"neutral-200",
				tonalScale,
				neutralScale,
				"oklch(0.922 0 0)"
			),
			"--sidebar-primary": findAndNormalize(
				"primary-500",
				tonalScale,
				neutralScale,
				"oklch(0.205 0 0)"
			),
			"--sidebar-primary-foreground": normalizeFull(
				ColorMath.formatOklch(primaryForeground.l, primaryForeground.c, primaryForeground.h),
				"oklch(0.985 0 0)"
			),
			"--sidebar-accent": findAndNormalize(
				"primary-100",
				tonalScale,
				neutralScale,
				"oklch(0.970 0 0)"
			),
			"--sidebar-accent-foreground": findAndNormalize(
				"primary-900",
				tonalScale,
				neutralScale,
				"oklch(0.205 0 0)"
			),
			"--sidebar-ring": findAndNormalize(
				"primary-400",
				tonalScale,
				neutralScale,
				"oklch(0.708 0 0)"
			),

			...chartColors.light,
		};
	}

	private static darkVars(method: Palette): CssVars {
		const { tonalScale, neutralScale, semanticColors } = method;
		const primary500 = tonalScale.find((s) => s.scale === "primary-500");
		const primaryColor = ColorMath.parseOklch(primary500?.color || "oklch(50% 0 0)");
		const chartColors = generateChartColors(primaryColor.h);

		const primaryForeground = ColorMath.getContrastingForegroundColor(primaryColor, 4.5);

		return {
			"--background": findAndNormalize("neutral-950", tonalScale, neutralScale, "oklch(0.145 0 0)"),
			"--foreground": findAndNormalize("neutral-50", tonalScale, neutralScale, "oklch(0.985 0 0)"),

			"--card": findAndNormalize("neutral-900", tonalScale, neutralScale, "oklch(0.205 0 0)"),
			"--card-foreground": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(0.985 0 0)"
			),
			"--popover": findAndNormalize("neutral-900", tonalScale, neutralScale, "oklch(0.205 0 0)"),
			"--popover-foreground": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(0.985 0 0)"
			),

			"--primary": normalizeFull(
				primary500?.color || "oklch(0.496 0.272 303.89)",
				"oklch(0.496 0.272 303.89)"
			),
			"--primary-foreground": normalizeFull(
				ColorMath.formatOklch(primaryForeground.l, primaryForeground.c, primaryForeground.h),
				"oklch(0.205 0 0)"
			),

			"--secondary": findAndNormalize("neutral-800", tonalScale, neutralScale, "oklch(0.269 0 0)"),
			"--secondary-foreground": findAndNormalize(
				"neutral-100",
				tonalScale,
				neutralScale,
				"oklch(0.985 0 0)"
			),
			"--muted": findAndNormalize("neutral-800", tonalScale, neutralScale, "oklch(0.269 0 0)"),
			"--muted-foreground": findAndNormalize(
				"neutral-400",
				tonalScale,
				neutralScale,
				"oklch(0.708 0 0)"
			),
			"--accent": findAndNormalize("neutral-800", tonalScale, neutralScale, "oklch(0.269 0 0)"),
			"--accent-foreground": findAndNormalize(
				"neutral-100",
				tonalScale,
				neutralScale,
				"oklch(0.985 0 0)"
			),

			"--destructive": normalizeFull(semanticColors.error.color, "oklch(0.704 0.191 22.216)"),
			"--destructive-foreground": normalizeFull(
				semanticColors.error.foreground,
				"oklch(0.98 0.02 25)"
			),

			"--border": findAndNormalize("neutral-800", tonalScale, neutralScale, "oklch(1 0 0 / 10%)"),
			"--input": findAndNormalize("neutral-700", tonalScale, neutralScale, "oklch(1 0 0 / 15%)"),
			"--ring": findAndNormalize("primary-400", tonalScale, neutralScale, "oklch(0.556 0 0)"),

			"--sidebar": findAndNormalize("neutral-900", tonalScale, neutralScale, "oklch(0.205 0 0)"),
			"--sidebar-foreground": findAndNormalize(
				"neutral-50",
				tonalScale,
				neutralScale,
				"oklch(0.985 0 0)"
			),
			"--sidebar-border": findAndNormalize(
				"neutral-800",
				tonalScale,
				neutralScale,
				"oklch(1 0 0 / 10%)"
			),
			"--sidebar-primary": findAndNormalize(
				"primary-500",
				tonalScale,
				neutralScale,
				"oklch(0.488 0.243 264.376)"
			),
			"--sidebar-primary-foreground": normalizeFull(
				ColorMath.formatOklch(primaryForeground.l, primaryForeground.c, primaryForeground.h),
				"oklch(0.985 0 0)"
			),
			"--sidebar-accent": findAndNormalize(
				"primary-800",
				tonalScale,
				neutralScale,
				"oklch(0.269 0 0)"
			),
			"--sidebar-accent-foreground": findAndNormalize(
				"primary-100",
				tonalScale,
				neutralScale,
				"oklch(0.985 0 0)"
			),
			"--sidebar-ring": findAndNormalize(
				"primary-400",
				tonalScale,
				neutralScale,
				"oklch(0.556 0 0)"
			),

			...chartColors.dark,
		};
	}

	private static formatVars(vars: CssVars, selector: string): string {
		const lines = Object.entries(vars)
			.map(([k, v]) => `  ${k}: ${v};`)
			.join("\n");
		return `${selector} {\n${lines}\n}`;
	}

	static generateTailwindV4CSS(method: Palette): string {
		const themeMap = `@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}`;

		const light = this.formatVars(this.lightVars(method), ":root");
		const dark = this.formatVars(this.darkVars(method), ".dark");

		const base = `@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}`;

		return `${themeMap}\n\n${light}\n\n${dark}\n\n${base}\n`;
	}
}
