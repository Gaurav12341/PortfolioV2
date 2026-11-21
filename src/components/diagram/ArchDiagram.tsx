"use client";

import * as React from "react";
import {
  Bot,
  Boxes,
  Brain,
  Cpu,
  Database,
  FileText,
  Layers,
  Monitor,
  Network,
  Server,
  ShieldCheck,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { edgeId, type DiagramEdge, type DiagramNode, type DiagramSpec, type NodeKind } from "./types";

const ICONS: Record<NodeKind, LucideIcon> = {
  service: Server,
  queue: Layers,
  db: Database,
  cache: Zap,
  client: Monitor,
  llm: Brain,
  gateway: Network,
  agent: Bot,
  human: User,
  source: FileText,
  guard: ShieldCheck,
  model: Cpu,
};

type Props = {
  spec: DiagramSpec;
  /** Index into spec.steps to highlight; null/undefined shows the whole system. */
  activeStep?: number | null;
  className?: string;
  /** Static thumbnail: no packets, no tooltips, no dash animation. */
  mini?: boolean;
};

type Placed = DiagramNode & { cx: number; cy: number; w: number };

/**
 * Data-driven architecture diagram rendered as SVG.
 *
 * - Nodes: rounded cards with a lucide icon per kind and a mono label.
 * - Edges: smooth cubic paths; async edges are dashed with flowing dashes.
 * - Packets: accent dots travel along highlighted edges (SMIL animateMotion,
 *   which works in Chrome, Safari and Firefox). Paused off-screen and in
 *   hidden tabs; removed under reduced motion.
 * - activeStep highlights that step's nodes/edges and dims the rest to 25%.
 * - Hover/tap a node for its note.
 * - a11y: role="img" + aria-label summary, plus a visually hidden ordered
 *   list of the steps and node notes.
 */
export function ArchDiagram({ spec, activeStep = null, className, mini = false }: Props) {
  const reduce = useReducedMotionSafe();
  const animated = !mini && !reduce;
  const step = activeStep != null ? spec.steps[activeStep] : null;
  const lit = React.useMemo(() => new Set(step?.highlight ?? []), [step]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Small screens scroll wide diagrams horizontally: bring the active step's
  // nodes into view when the step changes.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || !step || el.scrollWidth <= el.clientWidth + 4) return;
    const xs = spec.nodes.filter((n) => lit.has(n.id)).map((n) => n.x);
    if (!xs.length) return;
    const vbW = Number(spec.viewBox.split(/\s+/)[2]);
    const centre = ((Math.min(...xs) + Math.max(...xs)) / 2 / vbW) * el.scrollWidth;
    el.scrollTo({ left: Math.max(0, centre - el.clientWidth / 2), behavior: reduce ? "auto" : "smooth" });
  }, [step, lit, spec, reduce]);

  return (
    <div className={cn("relative", className)}>
      {spec.mobile ? (
        <>
          <DiagramSvg spec={spec} layout="desktop" lit={lit} step={step} animated={animated} mini={mini} className="hidden md:block" />
          <DiagramSvg spec={spec} layout="mobile" lit={lit} step={step} animated={animated} mini={mini} className="md:hidden" />
        </>
      ) : (
        <div
          ref={scrollRef}
          className={cn(spec.minWidth && !mini && "-mx-1 overflow-x-auto px-1 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0")}
          data-no-swipe={spec.minWidth ? "" : undefined}
        >
          <div
            className={spec.minWidth && !mini ? "min-w-[var(--diagram-min)] md:min-w-0" : undefined}
            style={spec.minWidth && !mini ? ({ "--diagram-min": `${spec.minWidth}px` } as React.CSSProperties) : undefined}
          >
            <DiagramSvg spec={spec} layout="desktop" lit={lit} step={step} animated={animated} mini={mini} />
          </div>
        </div>
      )}

      {!mini && (
        <div className="sr-only">
          <ol>
            {spec.steps.map((s) => (
              <li key={s.title}>
                {s.title}: {s.body}
              </li>
            ))}
          </ol>
          <ul>
            {spec.nodes
              .filter((n) => n.note)
              .map((n) => (
                <li key={n.id}>
                  {n.label}
                  {n.sub ? ` (${n.sub})` : ""}: {n.note}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DiagramSvg({
  spec,
  layout,
  lit,
  step,
  animated,
  mini,
  className,
}: {
  spec: DiagramSpec;
  layout: "desktop" | "mobile";
  lit: Set<string>;
  step: DiagramSpec["steps"][number] | null;
  animated: boolean;
  mini: boolean;
  className?: string;
}) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [hover, setHover] = React.useState<string | null>(null);
  const [paused, setPaused] = React.useState(false);
  const uid = React.useId().replace(/:/g, "");

  const viewBox = layout === "mobile" && spec.mobile ? spec.mobile.viewBox : spec.viewBox;
  const [, , vbW, vbH] = viewBox.split(/\s+/).map(Number);
  const nodeW = (layout === "mobile" && spec.mobile?.nodeW) || spec.nodeW || 170;
  const nodeH = spec.nodeH ?? 56;

  const placed = React.useMemo(() => {
    const map = new Map<string, Placed>();
    for (const n of spec.nodes) {
      const p = layout === "mobile" ? spec.mobile?.pos?.[n.id] : undefined;
      map.set(n.id, { ...n, cx: p?.[0] ?? n.x, cy: p?.[1] ?? n.y, w: n.w ?? nodeW });
    }
    return map;
  }, [spec, layout, nodeW]);

  // Pause SMIL + CSS animation off-screen and in hidden tabs.
  React.useEffect(() => {
    if (!animated) return;
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;
    let inView = false;
    const sync = () => {
      const run = inView && !document.hidden;
      setPaused(!run);
      try {
        if (run) svg.unpauseAnimations();
        else svg.pauseAnimations();
      } catch {
        /* SVG not rendered (display:none layout) */
      }
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io.observe(wrap);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [animated]);

  const isLit = (id: string) => !step || lit.has(id);

  // Edges that carry packets: the highlighted ones, or every non-dashed edge in overview.
  const packetEdges = spec.edges.filter(
    (e) => !e.muted && (step ? lit.has(edgeId(e)) : e.style !== "dashed"),
  );

  const hovered = hover ? placed.get(hover) : null;

  return (
    <div ref={wrapRef} className={cn("relative", className)} data-paused={paused || undefined}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        role="img"
        aria-label={spec.summary}
        className="block h-auto w-full overflow-visible [&[data-paused]_*]:[animation-play-state:paused]"
        data-paused={paused || undefined}
      >
        <defs>
          <marker
            id={`arrow-${uid}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        {/* Lanes (swimlanes / integration bus) */}
        {spec.lanes && (
          <g>
            {spec.lanes.map((ln) => {
              const on = isLit(`lane:${ln.id}`) || spec.nodes.some((n) => lit.has(n.id) && n.y > ln.y && n.y < ln.y + ln.h);
              const bus = ln.tone === "bus";
              return (
                <g key={ln.id} className="transition-opacity duration-500" style={{ opacity: !step || on ? 1 : 0.45 }}>
                  <rect
                    x={2}
                    y={ln.y}
                    width={vbW - 4}
                    height={ln.h}
                    rx={16}
                    className={cn(bus ? "fill-brand/[0.06] stroke-brand/30" : "fill-foreground/[0.025] stroke-line")}
                    strokeDasharray={bus ? "4 4" : undefined}
                  />
                  <text x={16} y={ln.y + 19} className={cn("font-mono", bus ? "fill-accent-text" : "fill-muted-foreground")} fontSize={10.5} fontWeight={600} letterSpacing={0.6}>
                    {ln.label.toUpperCase()}
                    {ln.sub && (
                      <tspan className="fill-muted-foreground" fontWeight={400} letterSpacing={0}>
                        {"  ·  "}
                        {ln.sub}
                      </tspan>
                    )}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Uplink rails (bus → lanes) */}
        {spec.rails && (
          <g className="transition-opacity duration-500" style={{ opacity: !step || lit.has("rails") ? 1 : 0.25 }}>
            {spec.rails.xs.map((x, i) => (
              <g key={x}>
                <path
                  id={`rail-${uid}-${i}`}
                  d={`M ${x} ${spec.rails!.from} L ${x} ${spec.rails!.to}`}
                  className="stroke-brand/35"
                  strokeWidth={1}
                  strokeDasharray="2 5"
                />
                {animated && (
                  <circle r={2.5} className="fill-brand">
                    <animateMotion dur="2.6s" begin={`-${(i * 0.65).toFixed(2)}s`} repeatCount="indefinite">
                      <mpath href={`#rail-${uid}-${i}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            ))}
          </g>
        )}

        {/* Edges */}
        <g>
          {spec.edges.map((e) => {
            const a = placed.get(e.from);
            const b = placed.get(e.to);
            if (!a || !b) return null;
            const id = edgeId(e);
            const d = edgePath(a, b, nodeH);
            const on = isLit(id);
            const dashed = e.style === "async" || e.style === "dashed" || e.muted;
            const mid = edgeMid(a, b, nodeH);
            const vert = anchors(a, b, nodeH).vertical;
            return (
              <g
                key={id}
                className="transition-opacity duration-500"
                style={{ opacity: e.muted ? 0.3 : on ? 1 : 0.25 }}
              >
                <path
                  id={`p-${uid}-${id}`}
                  d={d}
                  fill="none"
                  className={cn(
                    step && on ? "text-accent-text" : "text-foreground/30",
                    "transition-colors duration-500",
                  )}
                  stroke="currentColor"
                  strokeWidth={step && on ? 1.5 : 1.2}
                  strokeDasharray={dashed ? "5 5" : undefined}
                  markerEnd={`url(#arrow-${uid})`}
                  style={
                    dashed && animated && e.style === "async"
                      ? { animation: "dash-flow 1s linear infinite" }
                      : undefined
                  }
                />
                {e.gate && (
                  <g aria-hidden>
                    <circle cx={mid.x} cy={mid.y} r={8.5} className={cn("fill-background stroke-brand")} strokeWidth={1.2} />
                    <User x={mid.x - 5} y={mid.y - 5} width={10} height={10} className="text-accent-text" strokeWidth={2.4} />
                  </g>
                )}
                {e.label && !mini && (
                  <text
                    x={vert ? mid.x + 10 : mid.x}
                    y={vert ? mid.y + 4 : mid.y - 7}
                    textAnchor={vert ? "start" : "middle"}
                    className="fill-muted-foreground font-mono"
                    fontSize={11}
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Packets */}
        {animated && (
          <g key={step?.title ?? "all"} className="text-brand">
            {packetEdges.map((e, i) => (
              <circle key={edgeId(e)} r={3.5} fill="currentColor">
                <animateMotion
                  dur="1.6s"
                  begin={`-${(i * 0.32).toFixed(2)}s`}
                  repeatCount="indefinite"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                >
                  <mpath href={`#p-${uid}-${edgeId(e)}`} />
                </animateMotion>
              </circle>
            ))}
          </g>
        )}

        {/* Nodes */}
        <g>
          {[...placed.values()].map((n) => (
            <NodeCard
              key={n.id}
              n={n}
              h={nodeH}
              on={isLit(n.id)}
              emphasised={!!step && lit.has(n.id)}
              mini={mini}
              onEnter={() => setHover(n.id)}
              onLeave={() => setHover((h) => (h === n.id ? null : h))}
              onTap={() => setHover((h) => (h === n.id ? null : n.id))}
            />
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {!mini && hovered?.note && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 w-60 -translate-x-1/2 rounded-lg border border-line bg-surface-solid px-3 py-2 text-xs leading-relaxed text-foreground shadow-xl"
          style={{
            left: `${(hovered.cx / vbW) * 100}%`,
            top: `${((hovered.cy + nodeH / 2 + 8) / vbH) * 100}%`,
          }}
        >
          <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-wider text-accent-text">
            {hovered.label}
          </span>
          {hovered.note}
        </div>
      )}
    </div>
  );
}

function NodeCard({
  n,
  h,
  on,
  emphasised,
  mini,
  onEnter,
  onLeave,
  onTap,
}: {
  n: Placed;
  h: number;
  on: boolean;
  emphasised: boolean;
  mini: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onTap: () => void;
}) {
  const Icon = ICONS[n.kind];
  const x = n.cx - n.w / 2;
  const y = n.cy - h / 2;
  const dashedBorder = n.kind === "human" || n.muted;

  return (
    <g
      className={cn("transition-opacity duration-500", !mini && n.note && "cursor-pointer")}
      style={{ opacity: n.muted ? 0.35 : on ? 1 : 0.25 }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
      onClick={onTap}
      data-cursor="hover"
    >
      <rect
        x={x}
        y={y}
        width={n.w}
        height={h}
        rx={12}
        className={cn(
          "fill-surface-solid transition-colors duration-500",
          emphasised ? "stroke-brand" : "stroke-line-strong",
        )}
        strokeWidth={emphasised ? 1.5 : 1}
        strokeDasharray={dashedBorder ? "4 4" : undefined}
      />
      {/* Icon tile */}
      <rect
        x={x + 10}
        y={n.cy - 14}
        width={28}
        height={28}
        rx={7}
        className={cn(emphasised ? "fill-brand/15" : "fill-muted", "transition-colors duration-500")}
      />
      <Icon
        x={x + 17}
        y={n.cy - 7}
        width={14}
        height={14}
        className={emphasised ? "text-accent-text" : "text-muted-foreground"}
        strokeWidth={2}
        aria-hidden
      />
      <text
        x={x + 48}
        y={n.sub ? n.cy - 4 : n.cy + 4}
        className="fill-foreground font-mono"
        fontSize={12.5}
        fontWeight={600}
      >
        {n.label}
      </text>
      {n.sub && (
        <text x={x + 48} y={n.cy + 13} className="fill-muted-foreground font-mono" fontSize={10.5}>
          {n.sub}
        </text>
      )}
    </g>
  );
}

/* ── geometry ─────────────────────────────────────────────────────────── */

function anchors(a: Placed, b: Placed, h: number) {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const vertical = Math.abs(dy) > Math.abs(dx) * 0.6;
  if (vertical) {
    const s = Math.sign(dy) || 1;
    return {
      vertical,
      x1: a.cx,
      y1: a.cy + (s * h) / 2,
      x2: b.cx,
      y2: b.cy - (s * h) / 2 - s * 2,
    };
  }
  const s = Math.sign(dx) || 1;
  return {
    vertical,
    x1: a.cx + (s * a.w) / 2,
    y1: a.cy,
    x2: b.cx - (s * b.w) / 2 - s * 2,
    y2: b.cy,
  };
}

function edgePath(a: Placed, b: Placed, h: number) {
  const { vertical, x1, y1, x2, y2 } = anchors(a, b, h);
  if (vertical) {
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  }
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function edgeMid(a: Placed, b: Placed, h: number) {
  const { x1, y1, x2, y2 } = anchors(a, b, h);
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

export type { DiagramSpec, DiagramEdge };
