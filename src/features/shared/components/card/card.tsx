import React from "react";

export interface CardProps {
	className?: string;
	children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
	return (
		<div className={`bg-card text-card-foreground rounded-lg border p-6 shadow-sm ${className}`}>
			{children}
		</div>
	);
}
