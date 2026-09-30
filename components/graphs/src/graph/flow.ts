/**
 * Restyles the classes React Flow writes, for the graph recipe's canvas.
 *
 * @remarks
 *   React Flow places its layers by these rules and ships them as `base.css`. A component imports
 *   no stylesheet, so the canvas states the rules the kit needs, with the theme's tokens for every
 *   color: the pane under the viewport, the nodes and edges above it, the label layer the edges'
 *   controls render in, the corner panels, and the attribution link. The layers keep React Flow's
 *   own order inside the canvas, which isolates them from the page. An edge is the muted ink, and a
 *   selected or focused edge is the focus ink twice as wide. An edge on a traced path,
 *   `data-trace="on"`, is the ink twice as wide, and an edge off it fades to the theme's backdrop
 *   opacity. An added edge, `data-change="added"`, is the success ink twice as wide, a removed edge
 *   the error ink dashed and twice as wide, and an unchanged edge fades, so the dash tells a
 *   removed edge apart under forced colors too. An edge's `--graph-strength` multiplies both
 *   widths, 1 unless set, so a network's stronger link renders wider. A handle is a dot in the
 *   muted ink inside a ring in the panel's color, and a handle no edge meets, `data-unused`, is
 *   invisible and still measured. Under forced colors the edges and the handles take `CanvasText`,
 *   and a selected edge and a handle that takes connections `Highlight`. The viewport is hidden
 *   while React Flow's element has `data-placing`, which a preset sets until its nodes are laid out
 *   by their measured sizes.
 */

/**
 * Rules of React Flow's own layers: where each is placed, what takes the pointer, and in which
 * order.
 */
const LAYERS = {
  "& .react-flow": { direction: "ltr", inlineSize: "full", position: "relative" },
  "& .react-flow__background": { pointerEvents: "none", zIndex: "-1" },
  "& .react-flow__background-pattern.dots": { _highContrast: { fill: "GrayText" }, fill: "border" },
  "& .react-flow__container": {
    blockSize: "full",
    inlineSize: "full",
    insetBlockStart: "0",
    insetInlineStart: "0",
    position: "absolute",
  },
  "& .react-flow__edgelabel-renderer": {
    blockSize: "full",
    inlineSize: "full",
    insetBlockStart: "0",
    insetInlineStart: "0",
    pointerEvents: "none",
    position: "absolute",
    userSelect: "none",
  },
  "& .react-flow__nodes": { pointerEvents: "none", transformOrigin: "0 0" },
  "& .react-flow__pane": { touchAction: "none", zIndex: "1" },
  "& .react-flow__pane.draggable": { cursor: "pan" },
  "& .react-flow__pane.dragging": { cursor: "dragging" },
  "& .react-flow__renderer": { zIndex: "4" },
  "& .react-flow__selection": { zIndex: "6" },
  "& .react-flow__viewport": { pointerEvents: "none", transformOrigin: "0 0", zIndex: "2" },
  "& .react-flow[data-placing] .react-flow__viewport": { visibility: "hidden" },
};

/**
 * Rules of the nodes: React Flow's wrapper places each node, takes the pointer and the focus ring.
 */
const NODES = {
  "& .react-flow__node": {
    boxSizing: "border-box",
    focusRingColor: "border.focus",
    focusVisibleRing: "outside",
    pointerEvents: "all",
    position: "absolute",
    transformOrigin: "0 0",
    userSelect: "none",
  },
  "& .react-flow__node.draggable": { cursor: "drag" },
  "& .react-flow__node.draggable.dragging": { cursor: "dragging" },
  "& .react-flow__node.selectable": { cursor: "button" },
};

/**
 * Rules of the edges and of the line a connection in progress renders.
 */
const EDGES = {
  "& .react-flow__arrowhead polyline": {
    _highContrast: { stroke: "CanvasText" },
    stroke: "fg.muted",
  },
  "& .react-flow__arrowhead polyline.arrowclosed": {
    _highContrast: { fill: "CanvasText" },
    fill: "fg.muted",
  },
  "& .react-flow__connection": { pointerEvents: "none" },
  "& .react-flow__connection-path": {
    _highContrast: { stroke: "Highlight" },
    fill: "none",
    stroke: "border.focus",
    strokeWidth: "ring",
  },
  "& .react-flow__connectionline": { overflow: "visible", position: "absolute", zIndex: "1001" },
  "& .react-flow__edge": { outline: "none", pointerEvents: "visibleStroke" },
  "& .react-flow__edge-path": {
    _highContrast: { stroke: "CanvasText" },
    fill: "none",
    stroke: "fg.muted",
    strokeWidth: "calc({borderWidths.hairline} * var(--graph-strength, 1))",
    transition: "stroke {durations.fast} {easings.out}, opacity {durations.fast} {easings.out}",
  },
  "& .react-flow__edge:is(.selected, :focus-visible) .react-flow__edge-path": {
    _highContrast: { stroke: "Highlight" },
    stroke: "border.focus",
    strokeWidth: "ring",
  },
  "& .react-flow__edge.inactive": { pointerEvents: "none" },
  "& .react-flow__edge.selectable": { cursor: "button" },
  "& .react-flow__edge[data-change=added] .react-flow__edge-path": {
    _highContrast: { stroke: "CanvasText" },
    stroke: "border.success",
    strokeWidth: "calc({borderWidths.ring} * var(--graph-strength, 1))",
  },
  "& .react-flow__edge[data-change=removed] .react-flow__edge-path": {
    _highContrast: { stroke: "CanvasText" },
    stroke: "border.error",
    strokeDasharray: "{spacing.1.5} {spacing.1}",
    strokeWidth: "calc({borderWidths.ring} * var(--graph-strength, 1))",
  },
  "& .react-flow__edge[data-change=unchanged]": { opacity: "backdrop" },
  "& .react-flow__edge[data-trace=off]": { opacity: "backdrop" },
  "& .react-flow__edge[data-trace=on] .react-flow__edge-path": {
    _highContrast: { stroke: "CanvasText" },
    stroke: "fg",
    strokeWidth: "calc({borderWidths.ring} * var(--graph-strength, 1))",
  },
  "& .react-flow .react-flow__edges": { position: "absolute" },
  "& .react-flow .react-flow__edges svg": {
    overflow: "visible",
    pointerEvents: "none",
    position: "absolute",
  },
};

/**
 * Rules of a handle, which React Flow places on the side of its node that `position` names.
 */
const HANDLES = {
  "& .react-flow__handle": {
    _highContrast: { background: "CanvasText", borderColor: "Canvas" },
    background: "fg.muted",
    borderColor: "bg.panel",
    borderRadius: "full",
    borderStyle: "solid",
    borderWidth: "ring",
    boxSize: "2.5",
    pointerEvents: "none",
    position: "absolute",
  },
  "& .react-flow__handle-bottom": {
    insetBlockEnd: "0",
    left: "var(--graph-port-along, 50%)",
    transform: "translate(-50%, 50%)",
  },
  "& .react-flow__handle-left": {
    left: "0",
    top: "var(--graph-port-along, 50%)",
    transform: "translate(-50%, -50%)",
  },
  "& .react-flow__handle-right": {
    right: "0",
    top: "var(--graph-port-along, 50%)",
    transform: "translate(50%, -50%)",
  },
  "& .react-flow__handle-top": {
    insetBlockStart: "0",
    left: "var(--graph-port-along, 50%)",
    transform: "translate(-50%, -50%)",
  },
  "& .react-flow__handle.connectable": {
    _highContrast: { background: "Highlight" },
    background: "border.focus",
    pointerEvents: "all",
  },
  "& .react-flow__handle.connectionindicator": { cursor: "connect" },
  "& .react-flow__handle[data-unused]": { visibility: "hidden" },
};

/**
 * Rules of the corner panels: the attribution and any panel of the caller's.
 */
const PANELS = {
  "& .react-flow__attribution": {
    background: "bg.panel",
    color: "fg.muted",
    margin: "0",
    paddingInline: "1",
    textStyle: "body.xs",
  },
  "& .react-flow__attribution a": { color: "fg.muted", textDecoration: "none" },
  "& .react-flow__panel": { margin: "3", position: "absolute", zIndex: "5" },
  "& .react-flow__panel.bottom": { insetBlockEnd: "0" },
  "& .react-flow__panel.left": { left: "0" },
  "& .react-flow__panel.right": { right: "0" },
  "& .react-flow__panel.top": { insetBlockStart: "0" },
};

/**
 * Rules the canvas slot takes: React Flow's layers, nodes, edges, handles and panels.
 */
export const FLOW = { ...LAYERS, ...NODES, ...EDGES, ...HANDLES, ...PANELS };
