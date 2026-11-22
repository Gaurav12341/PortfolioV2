import { ImageResponse } from "next/og";
import { BrandMark } from "./_brand/mark";

/** iOS home-screen icon. iOS rounds the corners itself, so the tile is square. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandMark size={180} radius={0} />, size);
}
