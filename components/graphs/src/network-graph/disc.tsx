/**
 * Renders a network's node: a disc as wide as the node's weight with its icon, and its name under
 * it.
 *
 * @remarks
 *   The node's two handles are in the disc's hub, whose line is half a handle below the disc's
 *   middle, so every link runs to the disc's centre and under the disc. The handles take no
 *   connections, and the hub is hidden, so they take no press. The disc is hidden from
 *   assistive technology, because React Flow names the node's wrapper, and the name under the
 *   disc is the node's own words.
 */

import { type ReactElement } from "react";

import { Handle, type NodeProps, Position } from "@xyflow/react";

import { withContext } from "#graph/context.ts";
import { type DiscNode } from "#network-graph/view.ts";

/**
 * Renders the node's box with the recipe's disc node class.
 */
const Box = withContext("div", "discNode");

/**
 * Renders the disc with the recipe's disc class.
 */
const Round = withContext("div", "disc");

/**
 * Renders the hub the handles are in with the recipe's disc hub class.
 */
const Hub = withContext("div", "discHub");

/**
 * Renders the name with the recipe's disc label class.
 */
const Name = withContext("span", "discLabel");

/**
 * Renders the node's disc, its handles, its icon and its name from its data.
 *
 * @param props - React Flow's node props: the node's data among them.
 */
export function Disc({ data }: NodeProps<DiscNode>): ReactElement {
  const size: Record<string, string> = { "--graph-disc": `${String(data.disc)}px` };

  return (
    <Box data-dimmed={data.dimmed ? "" : undefined}>
      <Round aria-hidden style={size}>
        <Hub>
          <Handle isConnectable={false} position={Position.Top} type="target" />
          <Handle isConnectable={false} position={Position.Top} type="source" />
        </Hub>
        {data.icon}
      </Round>
      <Name>{data.label}</Name>
    </Box>
  );
}
