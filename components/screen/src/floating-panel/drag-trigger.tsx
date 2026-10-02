/**
 * Renders the area of the header that a person drags to move the panel.
 *
 * @remarks
 *   A press on a button inside the area does not start a drag. A double click maximizes a panel
 *   that can be resized, and restores a maximized or minimized one. The machine writes a `move`
 *   cursor inline even while the panel cannot move, so the area drops the machine's inline style
 *   and the recipe sets the cursor: `move` while the panel can move and `grabbing` while it moves.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#floating-panel/context.ts";
import { useFloatingPanel } from "#floating-panel/machine.ts";

/**
 * Renders the `div` with the floating panel's drag trigger class.
 */
const Drawn = withContext("div", "dragTrigger");

/**
 * Describes the props of the drag trigger: the props of a `div`.
 */
export type DragTriggerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the drag trigger with the machine's drag trigger props, but their inline style, merged
 * under the caller's.
 *
 * @param props - The title, a grip glyph and the props of a `div`.
 * @returns The `div` element.
 */
export function DragTrigger(props: DragTriggerProps): ReactElement {
  const { api } = useFloatingPanel();
  const { style: _cursor, ...machine } = api.getDragTriggerProps();

  return <Drawn {...mergeProps(machine, props)} />;
}
