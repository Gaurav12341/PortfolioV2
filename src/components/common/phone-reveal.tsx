"use client";

import { useState } from "react";
import { PHONE_NUMBER_B64 } from "@/lib/constants";

interface PhoneRevealProps {
  className?: string;
}

/**
 * Hides the phone number from the page source until clicked — the number
 * only ever exists in the DOM after user interaction, which keeps it out of
 * static scrapers looking for plaintext contact info.
 */
export function PhoneReveal({ className }: PhoneRevealProps) {
  const [revealed, setRevealed] = useState<string | null>(null);

  if (revealed) {
    return (
      <a href={`tel:${revealed}`} className={className}>
        {revealed}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRevealed(atob(PHONE_NUMBER_B64))}
      className={className}
    >
      Show phone number
    </button>
  );
}
