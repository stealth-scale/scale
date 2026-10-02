/**
 * Renders a resize trigger for each edge and corner of the panel, or for the axes a caller lists.
 *
 * @remarks
 *   The triggers render in the machine's order, the four edges before the four corners, so a
 *   corner stacks over the ends of the two edges beside it.
 */

import { type ReactElement } from "react";

import { resizeTriggerAxes, type ResizeTriggerAxis } from "@zag-js/floating-panel";

import { ResizeTrigger, type ResizeTriggerProps } from "#floating-panel/resize-trigger.tsx";

/**
 * Describes the props of the triggers: the axes and the props every trigger receives.
 */
export interface ResizeTriggersProps extends Omit<ResizeTriggerProps, "axis"> {
  /**
   * Edges and corners to render a trigger for. Defaults to all eight.
   */
  readonly axes?: readonly ResizeTriggerAxis[] | undefined;
}

/**
 * Renders one resize trigger per axis.
 *
 * @param props - The axes and the props of a `div`.
 * @returns A fragment with one trigger per axis.
 */
export function ResizeTriggers({
  axes = resizeTriggerAxes,
  ...props
}: ResizeTriggersProps): ReactElement {
  return (
    <>
      {axes.map((axis) => (
        <ResizeTrigger key={axis} {...props} axis={axis} />
      ))}
    </>
  );
}
