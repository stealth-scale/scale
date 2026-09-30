/**
 * Renders an edge or a corner of the panel that a person drags to resize it.
 *
 * @remarks
 *   The machine places the trigger inside the panel's edge by `axis` and writes its cursor inline.
 *   Shift keeps the panel's aspect ratio during the drag and Alt resizes it from its centre. The
 *   trigger is disabled, and the recipe hides it, while the panel cannot be resized: while it is
 *   minimized or maximized, disabled, or not resizable. It has no role, because the arrow keys on
 *   the panel resize it with Alt.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type ResizeTriggerAxis } from "@zag-js/floating-panel";
import { mergeProps } from "@zag-js/react";

import { withContext } from "#floating-panel/context.ts";
import { useFloatingPanel } from "#floating-panel/machine.ts";

/**
 * Renders the `div` with the floating panel's resize trigger class.
 */
const Drawn = withContext("div", "resizeTrigger");

/**
 * Describes the props of a resize trigger: the axis and the props of a `div`.
 */
export interface ResizeTriggerProps extends ComponentProps<typeof Drawn> {
  /**
   * Edge or corner the trigger resizes from: `n`, `e`, `s` or `w`, or `ne`, `nw`, `se` or `sw`.
   */
  readonly axis: ResizeTriggerAxis;
}

/**
 * Renders the trigger with the machine's resize trigger props merged under the caller's.
 *
 * @param props - The axis and the props of a `div`.
 * @returns The `div` element.
 */
export function ResizeTrigger({ axis, ...props }: ResizeTriggerProps): ReactElement {
  const { api } = useFloatingPanel();

  return <Drawn {...mergeProps(api.getResizeTriggerProps({ axis }), props)} />;
}
