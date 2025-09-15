import React, { useRef, useEffect, useState, useCallback } from "react";
import {
	generateHueGradient,
	generateLightnessGradient,
	generateChromaGradient,
} from "../lib/color-input-utils";
import { cn } from "@/features/shared/lib/utils";

export type ColorSliderType = "hue" | "lightness" | "chroma";

interface ColorSliderProps {
	"type": ColorSliderType;
	"value": number;
	"min": number;
	"max": number;
	"step": number;
	"onValueChange": (value: number[]) => void;
	"onValueCommit": (value: number[]) => void;
	"currentL"?: number;
	"currentC"?: number;
	"currentH"?: number;
	"className"?: string;
	"aria-label"?: string;
}

export function ColorSlider({
	type,
	value,
	min,
	max,
	step,
	onValueChange,
	onValueCommit,
	currentL = 50,
	currentC = 0.2,
	currentH = 240,
	className,
	"aria-label": ariaLabel,
}: ColorSliderProps) {
	const sliderRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	// Calculate percentage position
	const percentage = ((value - min) / (max - min)) * 100;

	// Generate gradient based on type
	const gradient = React.useMemo(() => {
		switch (type) {
			case "hue":
				return generateHueGradient(currentL, currentC);
			case "lightness":
				return generateLightnessGradient(currentC, currentH);
			case "chroma":
				return generateChromaGradient(currentL, currentH);
			default:
				return "";
		}
	}, [type, currentL, currentC, currentH]);

	// Handle mouse/touch events
	const handleStart = useCallback(
		(clientX: number) => {
			if (!sliderRef.current) return;
			setIsDragging(true);
			updateValue(clientX);
		},
		[min, max, step, onValueChange]
	);

	const handleMove = useCallback(
		(clientX: number) => {
			if (!isDragging || !sliderRef.current) return;
			updateValue(clientX);
		},
		[isDragging, min, max, step, onValueChange]
	);

	const handleEnd = useCallback(() => {
		if (!isDragging) return;
		setIsDragging(false);
		onValueCommit([value]);
	}, [isDragging, value, onValueCommit]);

	const updateValue = useCallback(
		(clientX: number) => {
			if (!sliderRef.current) return;

			const rect = sliderRef.current.getBoundingClientRect();
			const x = clientX - rect.left;
			const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
			const newValue = min + ((max - min) * percentage) / 100;

			// Apply step
			const steppedValue = Math.round(newValue / step) * step;
			const clampedValue = Math.max(min, Math.min(max, steppedValue));

			// Limit to 3 decimal places
			const roundedValue = parseFloat(clampedValue.toFixed(3));

			onValueChange([roundedValue]);
		},
		[min, max, step, onValueChange]
	);

	// Mouse events
	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		handleStart(e.clientX);
	};

	// Touch events
	const handleTouchStart = (e: React.TouchEvent) => {
		e.preventDefault();
		const touch = e.touches[0];
		handleStart(touch.clientX);
	};

	// Global mouse/touch move and up handlers
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
		const handleTouchMove = (e: TouchEvent) => {
			const touch = e.touches[0];
			handleMove(touch.clientX);
		};

		const handleMouseUp = () => handleEnd();
		const handleTouchEnd = () => handleEnd();

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.addEventListener("touchmove", handleTouchMove, { passive: false });
			document.addEventListener("touchend", handleTouchEnd);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [isDragging, handleMove, handleEnd]);

	return (
		<div
			ref={sliderRef}
			className={cn(
				"relative h-9 w-full cursor-pointer touch-none select-none",
				"border-border rounded-md border bg-gradient-to-r",
				"group",
				'data-[dragging="true"]:cursor-grabbing',
				className
			)}
			style={{
				background: gradient,
			}}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			data-dragging={isDragging ? "true" : "false"}
			role="slider"
			aria-label={ariaLabel}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			tabIndex={0}
			onKeyDown={(e) => {
				let newValue = value;
				const stepSize = step * (e.shiftKey ? 10 : 1);

				switch (e.key) {
					case "ArrowLeft":
					case "ArrowDown":
						e.preventDefault();
						newValue = Math.max(min, value - stepSize);
						break;
					case "ArrowRight":
					case "ArrowUp":
						e.preventDefault();
						newValue = Math.min(max, value + stepSize);
						break;
					case "Home":
						e.preventDefault();
						newValue = min;
						break;
					case "End":
						e.preventDefault();
						newValue = max;
						break;
					default:
						return;
				}

				onValueChange([newValue]);
				onValueCommit([parseFloat(newValue.toFixed(3))]);
			}}
		>
			{/* Handle */}
			<div
				className={cn(
					"border-border absolute top-1/2 -mt-6 -ml-2 h-12 w-4 rounded border-2",
					"hover:bg-muted border-border bg-card border",
					"[transition:left_300ms_ease-out,background-color_150ms_ease-out,transform_150ms_ease-out,box-shadow_150ms_ease-out,scale_150ms_ease-in]",
					"shadow-lg",
					"group-data-[dragging=true]:scale-110 group-data-[dragging=true]:shadow-xl"
				)}
				style={{
					left: `${percentage}%`,
				}}
			>
				{/* Handle indicator dots */}
				<div className="absolute top-1/2 left-1/2 -mt-2 -ml-0.25 flex flex-col gap-0.5">
					<div className="bg-foreground h-0.5 w-0.5 rounded-full transition-colors duration-300" />
					<div className="bg-foreground h-0.5 w-0.5 rounded-full transition-colors duration-300" />
					<div className="bg-foreground h-0.5 w-0.5 rounded-full transition-colors duration-300" />
					<div className="bg-foreground h-0.5 w-0.5 rounded-full transition-colors duration-300" />
				</div>
			</div>
		</div>
	);
}
