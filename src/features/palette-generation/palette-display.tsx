import React from "react";
import Card from "@/features/shared/components/card/card"; // React Card component
import Badge from "@/features/shared/components/badge/badge"; // React Badge component
import type { PaletteMethod } from "@/features/shared/types/global";

export interface PaletteDisplayProps {
	method: PaletteMethod;
}

export default function PaletteDisplay({ method }: PaletteDisplayProps) {
	return (
		<Card>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">{method.name}</h3>
						<p className="text-muted-foreground text-sm">{method.description}</p>
					</div>
					<Badge variant="outline">{method.tonalScale.length} shades</Badge>
				</div>

				{/* Tonal Scale */}
				<div>
					<h4 className="mb-2 text-sm font-medium">Tonal Scale</h4>
					<div className="grid grid-cols-11 gap-1">
						{method.tonalScale.map((shade) => (
							<div key={shade.scale} className="space-y-1">
								{" "}
								{/* `key` is crucial here */}
								<div
									className="hover:ring-ring h-12 cursor-pointer rounded border transition-all hover:ring-2"
									style={{ background: shade.color }}
									title={`${shade.scale}: ${shade.color}`}
								/>
								<div className="text-center font-mono text-xs">{shade.scale}</div>
							</div>
						))}
					</div>
				</div>

				{/* Semantic Colors */}
				<div>
					<h4 className="mb-2 text-sm font-medium">Semantic Colors</h4>
					<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
						{Object.entries(method.semanticColors).map(([name, colors]) => (
							<div key={name} className="space-y-2">
								{" "}
								{/* `key` is crucial here */}
								<div className="text-xs font-medium capitalize">{name}</div>
								<div className="space-y-1">
									<div
										className="hover:ring-ring flex h-8 cursor-pointer items-center justify-center rounded border text-xs font-medium transition-all hover:ring-2"
										style={{ background: colors.color, color: colors.foreground }}
										title={`${name}: ${colors.color}`}
									>
										Aa
									</div>
									<div className="text-muted-foreground text-center font-mono text-xs">
										{(() => {
											const match = colors.color.match(/oklch\((.+?)%/);
											return match ? `${match[1]}%` : "0%";
										})()}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Neutral Colors */}
				<div>
					<h4 className="mb-2 text-sm font-medium">Neutral Colors</h4>
					<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
						{method.neutralScale.map((shade) => (
							<div key={shade.scale} className="space-y-2">
								{" "}
								{/* `key` is crucial here */}
								<div className="text-xs font-medium capitalize">{shade.scale}</div>
								<div className="space-y-1">
									<div
										className="hover:ring-ring flex h-8 cursor-pointer items-center justify-center rounded border text-xs font-medium transition-all hover:ring-2"
										style={{ background: shade.color }}
										title={`${shade.scale}: ${shade.color}`}
									>
										Aa
									</div>
									<div className="text-muted-foreground text-center font-mono text-xs">
										{(() => {
											const match = shade.color.match(/oklch\((.+?)%/);
											return match ? `${match[1]}%` : "0%";
										})()}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
}
