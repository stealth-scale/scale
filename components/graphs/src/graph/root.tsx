/**
 * Renders a graph's figure and the React Flow provider every part reads.
 *
 * @remarks
 *   The element is a `figure`, named by its `Graph.Caption` through `aria-labelledby` while a
 *   caption renders. The root renders React Flow's provider, so the controls and the overview map
 *   read the canvas's store from anywhere inside the figure. `direction` tells every node which
 *   sides its ports are on. The root takes the recipe's `ratio`, which sets the canvas's height.
 */

import { type ComponentProps, type ReactElement, useId, useState } from "react";

import { ReactFlowProvider } from "@xyflow/react";

import { withProvider } from "#graph/context.ts";
import { CaptionProvider, DirectionContext, LabellingProvider } from "#graph/state.ts";
import { type GraphDirection } from "#layout/rank.ts";

/**
 * Renders the `figure` that provides the recipe's variants.
 */
const Figure = withProvider("figure", "root");

/**
 * Describes the props of the root: the graph's direction, the recipe's variants and the props of a
 * `figure`.
 *
 * @remarks
 *   The figure's props leave out `direction`, the style prop, because the root takes `direction` as
 *   the way the graph's edges run.
 */
export interface RootProps extends Omit<ComponentProps<typeof Figure>, "direction"> {
  /**
   * Way the graph's edges run, which puts each node's inputs and outputs on the matching sides.
   * Down unless stated.
   */
  readonly direction?: GraphDirection | undefined;
}

/**
 * Renders the figure inside React Flow's provider, named by its caption while one renders.
 *
 * @param props - The direction, the recipe's variants and the props of a `figure`.
 * @returns The `figure` element inside the providers.
 */
export function Root({ direction = "down", ...props }: RootProps): ReactElement {
  const captionId = useId();
  const [captioned, setCaptioned] = useState(false);

  return (
    <ReactFlowProvider>
      <DirectionContext value={direction}>
        <LabellingProvider value={setCaptioned}>
          <CaptionProvider value={captionId}>
            <Figure aria-labelledby={captioned ? captionId : undefined} {...props} />
          </CaptionProvider>
        </LabellingProvider>
      </DirectionContext>
    </ReactFlowProvider>
  );
}
