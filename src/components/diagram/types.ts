/** Data model for ArchDiagram (PHASES.md · Phase 4a). One spec per project. */

export type NodeKind =
  | "service"
  | "queue"
  | "db"
  | "cache"
  | "client"
  | "llm"
  | "gateway"
  | "agent"
  | "human"
  | "source"
  | "guard"
  | "model";

export type DiagramNode = {
  id: string;
  label: string;
  /** Optional second line (mono, muted), e.g. the model or tech. */
  sub?: string;
  kind: NodeKind;
  /** Centre position in viewBox units. */
  x: number;
  y: number;
  /** Width override (defaults to spec.nodeW). */
  w?: number;
  /** Shown in the hover/tap tooltip and the screen-reader list. */
  note?: string;
  /** Drawn faded + dashed (e.g. "internet" in the air-gapped variant). */
  muted?: boolean;
};

export type EdgeStyle = "sync" | "async" | "dashed";

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  style?: EdgeStyle;
  /** Human approval gate on this hop (drawn as a badge at the midpoint). */
  gate?: boolean;
  muted?: boolean;
};

export type DiagramStep = {
  title: string;
  body: string;
  /** Node ids, edge ids (`from->to`), lane ids (`lane:<id>`) or "rails". */
  highlight: string[];
};

/** Horizontal background band (swimlane / integration bus). */
export type DiagramLane = {
  id: string;
  label: string;
  sub?: string;
  y: number;
  h: number;
  tone?: "lane" | "bus";
};

/** Vertical "uplink" rails with packets flowing upward (e.g. a bus feeding lanes). */
export type DiagramRails = { xs: number[]; from: number; to: number };

export type DiagramLayout = {
  viewBox: string;
  /** Per-node position overrides for this layout. */
  pos?: Record<string, [number, number]>;
  nodeW?: number;
};

export type DiagramSpec = {
  /** One-sentence summary for aria-label. */
  summary: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  steps: DiagramStep[];
  viewBox: string;
  nodeW?: number;
  nodeH?: number;
  lanes?: DiagramLane[];
  rails?: DiagramRails;
  /** Optional alternative layout used below the md breakpoint. */
  mobile?: DiagramLayout;
  /**
   * Without a mobile layout, small screens scroll the diagram horizontally
   * at this minimum width (px) instead of shrinking the text to nothing.
   */
  minWidth?: number;
};

export const edgeId = (e: Pick<DiagramEdge, "from" | "to">) => `${e.from}->${e.to}`;
