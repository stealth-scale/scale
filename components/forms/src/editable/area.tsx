/**
 * Renders the cell that contains an editable's preview and its input.
 *
 * @remarks
 *   The preview shows while the editable is at rest and the input while it is being edited, so the
 *   two take turns in one cell. With `autoResize` both stay in the cell and the input takes the
 *   width of its text.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#editable/context.ts";
import { useEditable } from "#editable/machine.ts";

/**
 * Renders the `div` with the editable's area class.
 */
const Cell = withContext("div", "area");

/**
 * Describes the props of the area: the props of a `div`.
 */
export type AreaProps = ComponentProps<typeof Cell>;

/**
 * Renders the area with the machine's props.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element that contains the preview and the input.
 */
export function Area(props: AreaProps): ReactElement {
  const api = useEditable();

  return <Cell {...mergeProps(api.getAreaProps(), props)} />;
}
