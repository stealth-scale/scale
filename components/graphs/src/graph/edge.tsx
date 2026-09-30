/**
 * Renders the kit's edge: React Flow's bezier between two ports, and a control that removes it.
 *
 * @remarks
 *   React Flow's edge is a path 1px wide with a thin area the pointer can hit, which a mouse hits
 *   with difficulty and a finger misses. While the canvas takes edits and has a `removeGlyph`, a
 *   deletable edge renders the actions `IconButton` at its middle with the glyph, in React Flow's
 *   label layer, a tab stop like any button. The control is named by the edge data's
 *   `removeLabel`, else by the canvas's `removeName` over the names of the edge's ends, so an edge
 *   a person connects has a control too. A press removes the edge through React Flow, which calls
 *   `onEdgesDelete` as the Delete key does. The control leaves with its edge, so focus then moves
 *   to the node the edge left, unless the removal was refused.
 */

import { type ReactElement, use } from "react";

import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  type Edge as FlowEdge,
  getBezierPath,
  type InternalNode,
  type ReactFlowInstance,
  type ReactFlowState,
  useReactFlow,
  useStore,
} from "@xyflow/react";

import { IconButton } from "@stealthscale/component-actions";
import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#graph/context.ts";
import { nameOf } from "#graph/names.ts";
import { RemovalContext } from "#graph/state.ts";

/**
 * Renders the box the remove control is placed in, with the recipe's remove class.
 */
const Place = withContext("span", "remove");

/**
 * Describes the data of the kit's edge.
 */
export interface GraphEdgeData extends Record<string, unknown> {
  /**
   * Name of the edge's remove control, such as `Remove Draft to Judge`, over the name the canvas's
   * `removeName` writes.
   */
  readonly removeLabel?: string | undefined;
}

/**
 * Describes an edge the kit renders.
 */
export type GraphEdgeType = FlowEdge<GraphEdgeData>;

/**
 * Returns the name of an edge's end: the node's own name, else its id.
 */
function endOf(state: ReactFlowState, id: string): string {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- React Flow renders an edge only while both its ends are in its store.
  const node = state.nodeLookup.get(id) as InternalNode;

  return nameOf(node) ?? id;
}

/**
 * Focuses the node of an id inside a canvas, where it renders.
 *
 * @param canvas - React Flow's element, which contains the canvas's nodes.
 */
function focusNode(canvas: ParentNode, id: string): void {
  const nodes = canvas.querySelectorAll<HTMLElement>(".react-flow__node");

  [...nodes].find((node) => node.dataset["id"] === id)?.focus();
}

/**
 * Removes an edge through React Flow, then focuses the node it left unless the removal was
 * refused.
 *
 * @param flow - React Flow's instance, which removes the edge and calls the canvas's handlers.
 * @param canvas - React Flow's element, which contains the canvas's nodes.
 * @param edge - The edge's id and the id of the node it leaves.
 */
async function removed(
  flow: ReactFlowInstance,
  canvas: ParentNode,
  edge: Pick<EdgeProps, "id" | "source">,
): Promise<void> {
  const { deletedEdges } = await flow.deleteElements({ edges: [{ id: edge.id }] });

  if (deletedEdges.length > 0) focusNode(canvas, edge.source);
}

/**
 * Renders the edge's path, and its remove control while the canvas takes edits.
 *
 * @param props - React Flow's edge props: its ends, its sides and its data among them.
 */
export function Edge(props: EdgeProps<GraphEdgeType>): ReactElement {
  const [path, labelX, labelY] = getBezierPath(props);
  const flow = useReactFlow();
  const canvas = useStore((state) => state.domNode);
  const source = useStore((state) => endOf(state, props.source));
  const target = useStore((state) => endOf(state, props.target));
  const { editable, glyph, name } = use(RemovalContext);
  const at: Record<string, string> = {
    "--graph-edge-x": `${String(labelX)}px`,
    "--graph-edge-y": `${String(labelY)}px`,
  };

  return (
    <>
      <BaseEdge
        id={props.id}
        path={path}
        {...omitUndefined({ markerEnd: props.markerEnd, markerStart: props.markerStart })}
      />
      {editable && props.deletable !== false && glyph !== undefined ? (
        <EdgeLabelRenderer>
          <Place className="nodrag nopan" style={at}>
            <IconButton
              aria-label={props.data?.removeLabel ?? name({ source, target })}
              onClick={() => {
                // eslint-disable-next-line typescript/no-unsafe-type-assertion -- React Flow sets its element before it renders an edge.
                void removed(flow, canvas as HTMLDivElement, props);
              }}
              size="xs"
              variant="outline"
            >
              {glyph}
            </IconButton>
          </Place>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
