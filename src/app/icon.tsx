import { ImageResponse } from "next/og";
import { BrandMark } from "./_brand/mark";

/** Favicon set from the monogram: 32 for tabs, 192 and 512 for the manifest. */
const SIZES = { small: 32, medium: 192, large: 512 } as const;

export function generateImageMetadata() {
  return Object.entries(SIZES).map(([id, s]) => ({
    id,
    size: { width: s, height: s },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string> | string }) {
  const key = (await id) as keyof typeof SIZES;
  const s = SIZES[key] ?? 32;
  return new ImageResponse(<BrandMark size={s} />, { width: s, height: s });
}
