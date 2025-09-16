import { Card } from "@/features/shared/components/card/card";
import { Badge } from "@/features/shared/components/badge/badge";
import type { Palette } from "@/features/shared/types/global";

export interface PaletteDisplayProps {
	palette: Palette;
}

export function PaletteDisplay({ palette }: PaletteDisplayProps) {
	return (
		<Card>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">{palette.name}</h3>
						<p className="text-muted-foreground text-sm">{palette.description}</p>
					</div>
					<Badge variant="outline">{palette.tonalScale.length} shades</Badge>
				</div>
				{/* Base Scale */}
				<div>
					<h4 className="mb-2 text-sm font-medium">Base Scale</h4>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-1">
						{palette.baseScale.map((shade) => (
							<div key={shade.scale} className="space-y-1">
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

				{/* Tonal Scale */}
				<div>
					<h4 className="mb-2 text-sm font-medium">Tonal Scale</h4>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-1">
						{palette.tonalScale.map((shade) => (
							<div key={shade.scale} className="space-y-1">
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
					<div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3">
						{Object.entries(palette.semanticColors).map(([name, colors]) => (
							<div key={name} className="space-y-2">
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

				{/* Charts Colors */}
				<div>
					<h4 className="mb-2 text-sm font-medium">Charts Colors</h4>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3">
						{palette.chartScale.map((shade) => (
							<div key={shade.scale} className="space-y-2">
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

				{/* Neutral Colors */}
				<div>
					<h4 className="mb-2 text-sm font-medium">Neutral Colors</h4>
					<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
						{palette.neutralScale.map((shade) => (
							<div key={shade.scale} className="space-y-2">
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
