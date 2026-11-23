import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Shared 1200×630 share card for app/opengraph-image.tsx and the per-case-study
 * cards. Dark, with the hero's graph motif on the right. Fonts are static
 * Fontsource files (next/og can't read woff2 or variable fonts), read at build.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const BG = "#0b0a0d";
const FG = "#f2eef0";
const MUTED = "#a39aa0";
const ACCENT = "#fb3b64";

const NODES: [number, number][] = [
  [1000, 70], [1120, 110], [1060, 190], [1150, 260], [990, 290],
  [1090, 360], [1010, 440], [1140, 470], [1060, 540],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [4, 6], [5, 6], [5, 7], [6, 8], [7, 8],
];
/** the highlighted node */
const HOT = 5;

async function font(pkg: string, file: string) {
  return readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));
}

export type ShareCard = {
  /** small mono line next to the monogram */
  eyebrow: string;
  title: string;
  /** px; long titles should go smaller */
  titleSize?: number;
  uppercase?: boolean;
  lead?: string;
  sub?: string;
  chips: string[];
};

export async function renderShareCard({
  eyebrow,
  title,
  titleSize = 128,
  uppercase = false,
  lead,
  sub,
  chips,
}: ShareCard) {
  const [black, regular, mono] = await Promise.all([
    font("archivo", "archivo-latin-900-normal.woff"),
    font("archivo", "archivo-latin-400-normal.woff"),
    font("jetbrains-mono", "jetbrains-mono-latin-500-normal.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: BG,
          color: FG,
          fontFamily: "Archivo",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -260,
            top: -20,
            width: 760,
            height: 760,
            background:
              "radial-gradient(circle, rgba(251,59,100,0.26) 0%, rgba(251,59,100,0.08) 40%, rgba(251,59,100,0) 70%)",
          }}
        />
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          {EDGES.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
              stroke={ACCENT}
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
          ))}
          {NODES.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === HOT ? 9 : 5}
              fill={i === HOT ? ACCENT : BG}
              stroke={ACCENT}
              strokeWidth="2"
            />
          ))}
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Mono", fontSize: 22, color: MUTED }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.16)",
              color: FG,
              fontSize: 26,
            }}
          >
            gr
            <div style={{ width: 9, height: 22, background: ACCENT, borderRadius: 2 }} />
          </div>
          {eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 880 }}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 900,
              letterSpacing: titleSize > 100 ? -4 : -2,
              lineHeight: 0.98,
              textTransform: uppercase ? "uppercase" : "none",
            }}
          >
            {title}
          </div>
          {lead && <div style={{ marginTop: 18, fontSize: 44, display: "flex" }}>{lead}</div>}
          {sub && (
            <div style={{ marginTop: 14, fontSize: 26, lineHeight: 1.35, color: MUTED, display: "flex" }}>{sub}</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 14,
                border: "1px solid rgba(251,59,100,0.45)",
                background: "rgba(251,59,100,0.08)",
                fontFamily: "Mono",
                fontSize: 21,
                color: FG,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo", data: black, weight: 900, style: "normal" },
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
