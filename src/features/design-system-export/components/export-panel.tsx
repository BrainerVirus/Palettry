import React, { useEffect, useState } from "react";
import { Card } from "@/features/shared/components/card";
import { Button } from "@/features/shared/components/button";
import { Copy } from "lucide-react";

import { ShadcnExporter } from "@/features/design-system-export/lib/shadcn-exporter";
import { DaisyUIExporter } from "@/features/design-system-export/lib/daisyui-exporter";
import { TailwindV4Exporter } from "@/features/design-system-export/lib/tailwind-v4-exporter";
import type { Palette } from "@/features/shared/types/global";

export interface ExportPanelProps {
	palette: Palette;
}

export default function ExportPanel({ palette }: ExportPanelProps) {
	const [cssSnippet, setCssSnippet] = useState<string>("");
	const [selectedExporter, setSelectedExporter] = useState<"shadcn" | "daisyui" | "tailwindv4">(
		"shadcn"
	);

	// Effect to generate snippet whenever the `palette` prop changes
	useEffect(() => {
		if (palette) {
			let snippet = "";
			if (selectedExporter === "shadcn") {
				snippet = ShadcnExporter.generateTailwindV4CSS(palette);
			} else if (selectedExporter === "daisyui") {
				snippet = DaisyUIExporter.generateDaisyUIThemes(palette);
			} else if (selectedExporter === "tailwindv4") {
				snippet = TailwindV4Exporter.generateTailwindV4CSS(palette);
			}
			setCssSnippet(snippet.substring(0, 200) + "...");
		}
	}, [palette, selectedExporter]);

	const showCopyFeedback = (buttonElement: HTMLButtonElement, originalHtml: string) => {
		buttonElement.innerHTML = `
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      Copied!
    `;
		setTimeout(() => {
			buttonElement.innerHTML = originalHtml;
		}, 2000);
	};

	const handleCopy = async (
		type: "css" | "tailwind-config",
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		const buttonElement = event.currentTarget;
		let contentToCopy = "";
		if (selectedExporter === "shadcn") {
			if (palette) {
				contentToCopy = ShadcnExporter.generateTailwindV4CSS(palette);
			}
		} else if (selectedExporter === "daisyui") {
			if (palette) {
				contentToCopy = DaisyUIExporter.generateDaisyUIThemes(palette);
			}
		} else if (selectedExporter === "tailwindv4") {
			if (palette) {
				contentToCopy = TailwindV4Exporter.generateTailwindV4CSS(palette);
			}
		}
		if (contentToCopy) {
			const originalButtonContent = buttonElement.innerHTML;
			await navigator.clipboard.writeText(contentToCopy);
			showCopyFeedback(buttonElement, originalButtonContent);
		}
	};

	return (
		<Card>
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold">Export Design System</h3>
					<p className="text-muted-foreground text-sm">
						Export your generated palettes to different design systems
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant={selectedExporter === "shadcn" ? "default" : "outline"}
						onClick={() => setSelectedExporter("shadcn")}
					>
						shadcn/ui
					</Button>
					<Button
						size="sm"
						variant={selectedExporter === "daisyui" ? "default" : "outline"}
						onClick={() => setSelectedExporter("daisyui")}
					>
						DaisyUI
					</Button>
					<Button
						size="sm"
						variant={selectedExporter === "tailwindv4" ? "default" : "outline"}
						onClick={() => setSelectedExporter("tailwindv4")}
					>
						Tailwind v4
					</Button>
				</div>
				<div className="space-y-3">
					<div className="space-y-3 rounded-lg border p-4">
						<div className="flex gap-2">
							<Button size="sm" variant="outline" onClick={(e) => handleCopy("css", e)}>
								<Copy className="mr-2 h-4 w-4" />
								Copy CSS
							</Button>
						</div>
						<div className="bg-muted max-h-48 overflow-y-auto rounded-md p-3 font-mono text-sm">
							<pre>{cssSnippet}</pre>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
