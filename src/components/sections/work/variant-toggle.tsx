"use client";

import { Cloud, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export type RagMode = "cloud" | "airgap";

/** "Cloud ⇄ Air-gapped" switch for the Field Engineer RAG diagram. */
export function VariantToggle({ mode, onChange }: { mode: RagMode; onChange: (m: RagMode) => void }) {
  return (
    <div role="radiogroup" aria-label="Deployment variant" className="inline-flex rounded-full border border-line bg-background/70 p-1 text-xs font-medium">
      {(
        [
          { id: "cloud", label: "Cloud", Icon: Cloud },
          { id: "airgap", label: "Air-gapped", Icon: WifiOff },
        ] as const
      ).map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={mode === id}
          onClick={() => onChange(id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
            mode === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
