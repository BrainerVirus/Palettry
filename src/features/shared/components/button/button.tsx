import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	className?: string;
	children: React.ReactNode;
}

export default function Button({
	variant = "default",
	size = "md",
	className = "",
	children,
	...props
}: ButtonProps) {
	const variants = {
		default: "bg-primary text-primary-foreground hover:bg-primary/90",
		secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
		outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
		ghost: "hover:bg-accent hover:text-accent-foreground",
	};

	const sizes = {
		sm: "h-9 px-3 text-sm",
		md: "h-10 px-4 py-2",
		lg: "h-11 px-8",
	};

	return (
		<button
			className={`ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
