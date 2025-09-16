import React from "react";
import { Card } from "@/shared/components/card";
import { Button } from "@/shared/components/button";
import { Copy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/tabs";

import type { Palette } from "@/core/palette/types";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { DaisyUIExporter } from "@/core/export/daisyui";
import { ShadcnExporter } from "@/core/export/shadcn";
import { TailwindV4Exporter } from "@/core/export/tailwind";

const selectedExporterSignal = signal<"shadcn" | "daisyui" | "tailwindv4">("shadcn");

export interface ExportPanelProps {
	palette: Palette | null;
}

export function ExportPanel({ palette }: ExportPanelProps) {
	useSignals();
	const selectedExporter = selectedExporterSignal.value;

	const cssSnippet = (() => {
		const pal = palette;
		if (!pal) return "";
		let snippet = "";
		if (selectedExporter === "shadcn") snippet = ShadcnExporter.generateTailwindV4CSS(pal);
		else if (selectedExporter === "daisyui") snippet = DaisyUIExporter.generateDaisyUIThemes(pal);
		else if (selectedExporter === "tailwindv4")
			snippet = TailwindV4Exporter.generateTailwindV4CSS(pal);
		return snippet.substring(0, 200) + "...";
	})();

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
		const pal = palette;
		if (selectedExporter === "shadcn" && pal)
			contentToCopy = ShadcnExporter.generateTailwindV4CSS(pal);
		else if (selectedExporter === "daisyui" && pal)
			contentToCopy = DaisyUIExporter.generateDaisyUIThemes(pal);
		else if (selectedExporter === "tailwindv4" && pal)
			contentToCopy = TailwindV4Exporter.generateTailwindV4CSS(pal);
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
				<Tabs
					value={selectedExporter}
					onValueChange={(v) => {
						if (v === "shadcn" || v === "daisyui" || v === "tailwindv4")
							selectedExporterSignal.value = v;
					}}
				>
					<TabsList>
						<TabsTrigger value="shadcn">shadcn/ui</TabsTrigger>
						<TabsTrigger value="daisyui">DaisyUI</TabsTrigger>
						<TabsTrigger value="tailwindv4">Tailwind v4</TabsTrigger>
					</TabsList>
					<TabsContent value={selectedExporter} className="mt-2">
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
					</TabsContent>
				</Tabs>
			</div>
		</Card>
	);
}
