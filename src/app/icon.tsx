import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the "gr▌" monogram from components/brand/logo.tsx. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          background: "#0b0a0d",
          borderRadius: 14,
          color: "#f2eef0",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1.5,
          fontFamily: "monospace",
        }}
      >
        gr
        <div style={{ width: 9, height: 24, background: "#fb3b64", borderRadius: 2, marginTop: 4 }} />
      </div>
    ),
    { ...size },
  );
}
