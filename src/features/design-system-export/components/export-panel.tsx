import React, { useEffect, useState } from "react";
import Card from "@/features/shared/components/card/card"; // React Card component
import Button from "@/features/shared/components/button/button"; // React Button component
import { Copy, Download } from "lucide-react"; // Ensure lucide-react is installed

import { ShadcnExporter } from "@/features/design-system-export/lib/shadcn-exporter"; // Import your ShadcnExporter
import type { Palette } from "@/features/shared/types/global";

export interface ExportPanelProps {
	palette: Palette;
}

export default function ExportPanel({ palette }: ExportPanelProps) {
	const [cssSnippet, setCssSnippet] = useState<string>("");

	// Effect to generate snippet whenever the `palette` prop changes
	useEffect(() => {
		if (palette) {
			const snippet = ShadcnExporter.generateTailwindV4CSS(palette).substring(0, 200) + "...";
			setCssSnippet(snippet);
		}
	}, [palette]);

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
		if (type === "css") {
			if (palette) {
				contentToCopy = ShadcnExporter.generateTailwindV4CSS(palette);
			}
		} else if (type === "tailwind-config") {
			if (palette) {
				contentToCopy = ShadcnExporter.generateTailwindV4CSS(palette);
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
					<h3 className="text-lg font-semibold">Export to shadcn/ui</h3>
					<p className="text-muted-foreground text-sm">
						Export your generated palettes as shadcn/ui CSS variables
					</p>
				</div>
				<div className="space-y-3">
					<div className="space-y-3 rounded-lg border p-4">
						<div className="flex items-center justify-between">
							<h4 className="font-medium">{palette?.name}</h4>
							<div className="flex gap-2">
								<Button size="sm" variant="outline" onClick={(e) => handleCopy("css", e)}>
									<Copy className="mr-2 h-4 w-4" />
									Copy CSS
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={(e) => handleCopy("tailwind-config", e)}
								>
									<Download className="mr-2 h-4 w-4" />
									Tailwind Config
								</Button>
							</div>
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
