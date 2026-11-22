/**
 * The "gr▌" monogram (components/brand/logo.tsx) for next/og icon routes.
 * Everything scales from the canvas size so 32px and 512px stay identical.
 */
export function BrandMark({ size, radius = 0.22 }: { size: number; radius?: number }) {
  const u = size / 64;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3 * u,
        background: "#0b0a0d",
        borderRadius: size * radius,
        color: "#f2eef0",
        fontSize: 30 * u,
        fontWeight: 700,
        letterSpacing: -1.5 * u,
        fontFamily: "monospace",
      }}
    >
      gr
      <div style={{ width: 9 * u, height: 24 * u, background: "#fb3b64", borderRadius: 2 * u, marginTop: 4 * u }} />
    </div>
  );
}
