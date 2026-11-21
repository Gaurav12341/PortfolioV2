"use client";

import dynamic from "next/dynamic";

/**
 * Code-split the canvas so it never blocks the hero text (the LCP element).
 * The background is decorative, so there's nothing to render while it loads.
 */
const SystemGraph = dynamic(() => import("./SystemGraph"), { ssr: false });

export function GraphLoader({ className }: { className?: string }) {
  return <SystemGraph className={className} />;
}
