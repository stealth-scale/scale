/**
 * Renders the row that contains an editable's triggers.
 *
 * @remarks
 *   The row sits in the grid's second column, beside the area. The edit trigger shows at rest, and
 *   the save and cancel triggers while the editable is being edited.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#editable/context.ts";
import { useEditable } from "#editable/machine.ts";

/**
 * Renders the `div` with the editable's control class.
 */
const Row = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Row>;

/**
 * Renders the control with the machine's props.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element that contains the triggers.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useEditable();

  return <Row {...mergeProps(api.getControlProps(), props)} />;
}
