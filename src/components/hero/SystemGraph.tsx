"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   SystemGraph: the hero's live "distributed system" background.

   A 2D canvas of service nodes and edges. Accent "packets" travel along
   routes (client → gateway → topic → consumer → db, retrieval → llm, …) as
   if messages were flowing through a pipeline. Nodes drift a few px; on
   desktop the cursor bends nearby edges and lights the nearest node.

   Performance rules (PHASES.md §0):
   - drawn at devicePixelRatio (capped at 2)
   - rAF loop pauses when off-screen (IntersectionObserver) and when the tab
     is hidden; mobile is capped at 30 fps
   - prefers-reduced-motion → one static frame, no loop
   - colours come from the CSS theme tokens and update on theme change
   ────────────────────────────────────────────────────────────────────────── */

type NodeDef = { id: string; x: number; y: number; label?: string };
type RouteDef = { path: string[]; weight: number };
type Layout = { nodes: NodeDef[]; edges: [string, string][]; routes: RouteDef[] };

/** Desktop: 20 nodes in loose clusters, weighted to the right of the text. */
const DESKTOP: Layout = {
  nodes: [
    // ingress
    { id: "client", x: 0.52, y: 0.11, label: "client" },
    { id: "gw", x: 0.63, y: 0.2, label: "api-gw" }, // nudged above the nameplate
    { id: "auth", x: 0.76, y: 0.12, label: "auth" },
    // event pipeline
    { id: "producer", x: 0.67, y: 0.47, label: "producer" },
    { id: "topic", x: 0.86, y: 0.37, label: "orders.topic" }, // nudged right of the nameplate
    { id: "consumer", x: 0.92, y: 0.53, label: "consumer-grp" },
    { id: "dlq", x: 0.95, y: 0.22, label: "dlq" },
    { id: "pg", x: 0.86, y: 0.74, label: "postgres" },
    { id: "redis", x: 0.74, y: 0.62, label: "redis" },
    // retrieval / AI
    { id: "retriever", x: 0.57, y: 0.66, label: "retriever" },
    { id: "qdrant", x: 0.66, y: 0.88, label: "qdrant" },
    { id: "bm25", x: 0.49, y: 0.9, label: "bm25" },
    { id: "llm", x: 0.79, y: 0.9, label: "llm" },
    { id: "embed", x: 0.42, y: 0.74 },
    // ambient (sits behind the text, mostly masked)
    { id: "a1", x: 0.06, y: 0.2 },
    { id: "a2", x: 0.2, y: 0.1 },
    { id: "metrics", x: 0.35, y: 0.08, label: "metrics" },
    { id: "a3", x: 0.1, y: 0.86 },
    { id: "a4", x: 0.27, y: 0.93 },
    { id: "a5", x: 0.98, y: 0.92 },
  ],
  edges: [
    ["client", "gw"],
    ["gw", "auth"],
    ["gw", "producer"],
    ["producer", "topic"],
    ["topic", "consumer"],
    ["consumer", "pg"],
    ["consumer", "dlq"],
    ["topic", "dlq"],
    ["gw", "redis"],
    ["redis", "pg"],
    ["gw", "retriever"],
    ["retriever", "qdrant"],
    ["retriever", "bm25"],
    ["retriever", "llm"],
    ["qdrant", "llm"],
    ["embed", "qdrant"],
    ["embed", "retriever"],
    ["a1", "a2"],
    ["a2", "metrics"],
    ["metrics", "client"],
    ["a3", "a4"],
    ["a4", "bm25"],
    ["a3", "embed"],
    ["llm", "a5"],
    ["pg", "a5"],
  ],
  routes: [
    { path: ["client", "gw", "producer", "topic", "consumer", "pg"], weight: 5 },
    { path: ["client", "gw", "redis", "pg"], weight: 3 },
    { path: ["client", "gw", "retriever", "qdrant", "llm"], weight: 4 },
    { path: ["client", "gw", "retriever", "llm"], weight: 2 },
    { path: ["retriever", "bm25"], weight: 1 },
    { path: ["topic", "consumer", "dlq"], weight: 1 },
    { path: ["client", "gw", "auth"], weight: 2 },
    { path: ["embed", "qdrant"], weight: 1 },
    { path: ["a1", "a2", "metrics", "client"], weight: 1 },
  ],
};

/**
 * Mobile: 8 nodes hugging the top and bottom edges and the sides, so the
 * text block in the middle stays clear.
 */
const MOBILE: Layout = {
  nodes: [
    { id: "gw", x: 0.12, y: 0.0, label: "api-gw" },
    { id: "producer", x: 0.5, y: 0.02, label: "producer" },
    { id: "topic", x: 0.86, y: 0.0, label: "orders.topic" },
    { id: "consumer", x: 0.84, y: 1.0, label: "consumer-grp" },
    { id: "pg", x: 0.48, y: 0.985, label: "postgres" },
    { id: "redis", x: 0.12, y: 1.0, label: "redis" },
    { id: "qdrant", x: 0.98, y: 0.5 },
    { id: "llm", x: 0.02, y: 0.5 },
  ],
  edges: [
    ["gw", "producer"],
    ["producer", "topic"],
    ["topic", "qdrant"],
    ["qdrant", "consumer"],
    ["consumer", "pg"],
    ["pg", "redis"],
    ["redis", "llm"],
    ["llm", "gw"],
  ],
  routes: [
    { path: ["gw", "producer", "topic", "qdrant", "consumer", "pg"], weight: 3 },
    { path: ["pg", "redis", "llm", "gw"], weight: 2 },
    { path: ["gw", "producer", "topic"], weight: 1 },
  ],
};

const MOBILE_BREAKPOINT = 768;
const MAX_PACKETS = 10;

type RNode = NodeDef & {
  bx: number; // base position (px)
  by: number;
  x0: number; // current position (px)
  y0: number;
  phase: number;
  amp: number;
  freq: number;
  hover: number; // 0..1
  pulse: number; // 0..1, flashes when a packet arrives
  w: number; // pill width (labelled nodes)
};
type REdge = { a: RNode; b: RNode; cx: number; cy: number; heat: number };
type Packet = { route: RNode[]; seg: number; t: number; speed: number; delay: number };

export default function SystemGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let mobile = false;
    let layout: Layout = DESKTOP;
    let nodes: RNode[] = [];
    let byId = new Map<string, RNode>();
    let edges: REdge[] = [];
    let edgeByKey = new Map<string, REdge>();
    let packets: Packet[] = [];
    let routeBag: RNode[][] = [];

    const colors = { text: "#141216", accent: "#e11d48", bg: "#f3e9e6" };
    let mono = "ui-monospace, monospace";
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      colors.text = cs.getPropertyValue("--text").trim() || colors.text;
      colors.accent = cs.getPropertyValue("--accent").trim() || colors.accent;
      colors.bg = cs.getPropertyValue("--bg").trim() || colors.bg;
      mono = cs.getPropertyValue("--font-brand-mono").trim() || mono;
    };

    const pointer = { x: 0, y: 0, active: false };

    /* ── build / resize ───────────────────────────────────────────────── */
    const labelFont = () => `500 ${mobile ? 10 : 10.5}px ${mono}`;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nextMobile = w < MOBILE_BREAKPOINT;
      const layoutChanged = nextMobile !== mobile || nodes.length === 0;
      mobile = nextMobile;
      layout = mobile ? MOBILE : DESKTOP;

      const padX = mobile ? 20 : 56;
      const padTop = mobile ? 84 : 96; // clear the nav
      const padBottom = mobile ? 22 : 56;
      ctx.font = labelFont();

      const prev = byId;
      nodes = layout.nodes.map((n, i) => {
        const old = prev.get(n.id);
        const bx = padX + n.x * (w - padX * 2);
        const by = padTop + n.y * (h - padTop - padBottom);
        return {
          ...n,
          bx,
          by,
          x0: bx,
          y0: by,
          phase: old?.phase ?? i * 1.7,
          amp: old?.amp ?? 2.5 + ((i * 37) % 30) / 10, // 2.5 – 5.5 px
          freq: old?.freq ?? 0.25 + ((i * 13) % 10) / 40,
          hover: 0,
          pulse: 0,
          w: n.label ? ctx.measureText(n.label).width + 16 : 0,
        };
      });
      byId = new Map(nodes.map((n) => [n.id, n]));
      edges = layout.edges.map(([a, b]) => ({
        a: byId.get(a)!,
        b: byId.get(b)!,
        cx: 0,
        cy: 0,
        heat: 0,
      }));
      edgeByKey = new Map(edges.map((e) => [`${e.a.id}>${e.b.id}`, e]));

      // Weighted bag of routes to sample from.
      routeBag = [];
      layout.routes.forEach((r) => {
        const path = r.path.map((id) => byId.get(id)!).filter(Boolean);
        for (let i = 0; i < r.weight; i++) routeBag.push(path);
      });

      if (layoutChanged) packets = [];
      else packets.forEach((p) => (p.route = p.route.map((n) => byId.get(n.id)!)));
    };

    const edgeFor = (a: RNode, b: RNode): { e: REdge; reversed: boolean } | null => {
      const fwd = edgeByKey.get(`${a.id}>${b.id}`);
      if (fwd) return { e: fwd, reversed: false };
      const rev = edgeByKey.get(`${b.id}>${a.id}`);
      return rev ? { e: rev, reversed: true } : null;
    };

    /* ── simulation ───────────────────────────────────────────────────── */
    const spawn = (route?: RNode[], delay = 0) => {
      if (packets.length >= MAX_PACKETS || routeBag.length === 0) return;
      const r = route ?? routeBag[Math.floor(Math.random() * routeBag.length)];
      packets.push({
        route: r,
        seg: 0,
        t: 0,
        speed: (mobile ? 90 : 130) * (0.85 + Math.random() * 0.3),
        delay,
      });
    };

    let spawnTimer = 0;
    let burstTimer = 3;

    const update = (time: number, dt: number) => {
      // Node drift + hover
      let nearest: RNode | null = null;
      let nearestD = mobile ? 0 : 110;
      for (const n of nodes) {
        n.x0 = n.bx + Math.sin(time * n.freq + n.phase) * n.amp;
        n.y0 = n.by + Math.cos(time * n.freq * 0.8 + n.phase) * n.amp;
        if (pointer.active) {
          const d = Math.hypot(pointer.x - n.x0, pointer.y - n.y0);
          if (d < nearestD) {
            nearestD = d;
            nearest = n;
          }
        }
      }
      for (const n of nodes) {
        const target = n === nearest ? 1 : 0;
        n.hover += (target - n.hover) * Math.min(1, dt * 10);
        n.pulse = Math.max(0, n.pulse - dt * 1.6);
      }

      // Edge control points: bend gently toward a nearby cursor
      const R = 170;
      for (const e of edges) {
        const mx = (e.a.x0 + e.b.x0) / 2;
        const my = (e.a.y0 + e.b.y0) / 2;
        e.cx = mx;
        e.cy = my;
        if (pointer.active) {
          const dx = pointer.x - mx;
          const dy = pointer.y - my;
          const d = Math.hypot(dx, dy);
          if (d < R) {
            const k = (1 - d / R) ** 2 * 0.35;
            e.cx += dx * k;
            e.cy += dy * k;
          }
        }
        e.heat = Math.max(0, e.heat - dt * 1.2);
      }

      // Packets
      for (const p of packets) {
        if (p.delay > 0) {
          p.delay -= dt;
          continue;
        }
        const a = p.route[p.seg];
        const b = p.route[p.seg + 1];
        const len = Math.max(20, Math.hypot(b.x0 - a.x0, b.y0 - a.y0));
        p.t += (p.speed * dt) / len;
        const link = edgeFor(a, b);
        if (link) link.e.heat = Math.min(1, link.e.heat + dt * 3);
        if (p.t >= 1) {
          b.pulse = 1;
          p.seg += 1;
          p.t = 0;
        }
      }
      packets = packets.filter((p) => p.seg < p.route.length - 1);

      // Spawning: steady trickle + occasional bursts
      spawnTimer -= dt;
      burstTimer -= dt;
      const target = mobile ? 5 : 8;
      if (spawnTimer <= 0 && packets.length < target) {
        spawn();
        spawnTimer = 0.35 + Math.random() * 0.45;
      }
      if (burstTimer <= 0) {
        const r = routeBag[Math.floor(Math.random() * routeBag.length)];
        spawn(r, 0);
        spawn(r, 0.14);
        spawn(r, 0.28);
        burstTimer = 4 + Math.random() * 3;
      }
    };

    /* ── drawing ──────────────────────────────────────────────────────── */
    const quad = (e: REdge, t: number, reversed: boolean) => {
      const tt = reversed ? 1 - t : t;
      const u = 1 - tt;
      return {
        x: u * u * e.a.x0 + 2 * u * tt * e.cx + tt * tt * e.b.x0,
        y: u * u * e.a.y0 + 2 * u * tt * e.cy + tt * tt * e.b.y0,
      };
    };

    const roundRect = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      // Edges
      ctx.strokeStyle = colors.text;
      for (const e of edges) {
        ctx.globalAlpha = 0.18 + e.heat * 0.09;
        ctx.beginPath();
        ctx.moveTo(e.a.x0, e.a.y0);
        ctx.quadraticCurveTo(e.cx, e.cy, e.b.x0, e.b.y0);
        ctx.stroke();
      }

      // Packets (under the nodes so they slide in/out of them)
      ctx.fillStyle = colors.accent;
      for (const p of packets) {
        if (p.delay > 0) continue;
        const link = edgeFor(p.route[p.seg], p.route[p.seg + 1]);
        if (!link) continue;
        const { x, y } = quad(link.e, p.t, link.reversed);
        ctx.globalAlpha = 0.16;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2.25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes
      ctx.font = labelFont();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const n of nodes) {
        const glow = Math.max(n.hover, n.pulse * 0.8);
        if (n.label) {
          const nh = 20;
          const x = n.x0 - n.w / 2;
          const y = n.y0 - nh / 2;
          roundRect(x, y, n.w, nh, 6);
          ctx.globalAlpha = 0.92;
          ctx.fillStyle = colors.bg;
          ctx.fill();
          ctx.globalAlpha = 0.3 + glow * 0.5;
          ctx.strokeStyle = glow > 0.05 ? colors.accent : colors.text;
          ctx.stroke();
          ctx.globalAlpha = 0.56 + n.hover * 0.4;
          ctx.fillStyle = colors.text;
          ctx.fillText(n.label, n.x0, n.y0 + 0.5);
        } else {
          ctx.globalAlpha = 0.36 + glow * 0.5;
          ctx.fillStyle = glow > 0.05 ? colors.accent : colors.text;
          ctx.beginPath();
          ctx.arc(n.x0, n.y0, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    /** Reduced motion: one representative frame with a few packets in flight. */
    const drawStatic = () => {
      update(0, 0);
      packets = [];
      const picks = layout.routes.slice(0, mobile ? 2 : 4);
      picks.forEach((r, i) => {
        const route = r.path.map((id) => byId.get(id)!);
        packets.push({ route, seg: Math.min(i, route.length - 2), t: 0.45, speed: 0, delay: 0 });
      });
      draw();
    };

    /* ── loop + lifecycle ─────────────────────────────────────────────── */
    let raf = 0;
    let running = false;
    let last = 0;
    let lastDrawn = 0;
    let inView = true;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const minGap = mobile ? 1000 / 30 : 0;
      if (now - lastDrawn < minGap - 1) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      lastDrawn = now;
      update(now / 1000, dt);
      draw();
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (inView && !document.hidden ? start() : stop());

    readTheme();
    build();
    if (reduce) drawStatic();
    else sync();

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) drawStatic();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    // Theme switch → re-read colours (and redraw if static)
    const mo = new MutationObserver(() => {
      readTheme();
      if (reduce) drawStatic();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Labels were measured before Geist Mono may have loaded
    document.fonts?.ready.then(() => {
      readTheme();
      build();
      if (reduce) drawStatic();
    });

    const onPointer = (e: PointerEvent) => {
      if (!finePointer || mobile || reduce) return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.y >= 0 && pointer.y <= r.height;
    };
    const onLeave = () => (pointer.active = false);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
