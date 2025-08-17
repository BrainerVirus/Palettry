export interface CSSVariables {
	[key: string]: string;
}

export interface TailwindColorScale {
	[key: string]: string;
}

export interface TailwindColors {
	primary: TailwindColorScale & {
		DEFAULT: string;
		foreground: string;
	};
	secondary: {
		DEFAULT: string;
		foreground: string;
	};
	destructive: {
		DEFAULT: string;
		foreground: string;
	};
	muted: {
		DEFAULT: string;
		foreground: string;
	};
	accent: {
		DEFAULT: string;
		foreground: string;
	};
	popover: {
		DEFAULT: string;
		foreground: string;
	};
	card: {
		DEFAULT: string;
		foreground: string;
	};
	border: string;
	input: string;
	ring: string;
	background: string;
	foreground: string;
}

export interface ExportFormat {
	css: string;
	tailwindConfig: string;
}
