import React from "react";

export interface BadgeProps {
	variant?: "default" | "secondary" | "outline" | "destructive";
	className?: string;
	children: React.ReactNode;
}

export default function Badge({ variant = "default", className = "", children }: BadgeProps) {
	const variants = {
		default: "bg-primary text-primary-foreground hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
		outline: "text-foreground border border-input",
		destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
	};

	return (
		<div
			className={`focus:ring-ring inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${variants[variant]} ${className}`}
		>
			{children}
		</div>
	);
}
