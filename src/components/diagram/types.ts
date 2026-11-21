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
};

export type EdgeStyle = "sync" | "async" | "dashed";

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  style?: EdgeStyle;
};

export type DiagramStep = {
  title: string;
  body: string;
  /** Node ids and edge ids (`from->to`) to highlight. */
  highlight: string[];
};

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
  /** Optional alternative layout used below the md breakpoint. */
  mobile?: DiagramLayout;
};

export const edgeId = (e: Pick<DiagramEdge, "from" | "to">) => `${e.from}->${e.to}`;
