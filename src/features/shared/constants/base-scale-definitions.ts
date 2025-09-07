export const BASE_SCALE_DEFINITIONS = [
	{ scale: "base-50", l: 100, c: 0 }, // Pure white
	{ scale: "base-100", l: 99, c: 0.001 }, // Near white slight tint
	{ scale: "base-200", l: 98, c: 0.002 },
	{ scale: "base-300", l: 97, c: 0.004 },
	{ scale: "base-400", l: 94, c: 0.006 },
	{ scale: "base-500", l: 50, c: 0 }, // mid neutral
	{ scale: "base-600", l: 40, c: 0.005 },
	{ scale: "base-700", l: 30, c: 0.004 },
	{ scale: "base-800", l: 20, c: 0.003 },
	{ scale: "base-900", l: 10, c: 0.002 },
	{ scale: "base-950", l: 5, c: 0.001 },
] as const;
