/**
 * Renders the header row of a view: the previous trigger, the view trigger and the next trigger.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useView } from "#date-picker/scopes.ts";

/**
 * Renders the `div` with the date picker's view control class.
 */
const Headed = withContext("div", "viewControl");

/**
 * Describes the props of the view control: the props of a `div`.
 */
export type ViewControlProps = ComponentProps<typeof Headed>;

/**
 * Renders the header row with the machine's view control props for its view.
 *
 * @param props - The triggers and the props of a `div`.
 * @returns The `div` element.
 */
export function ViewControl(props: ViewControlProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();

  return <Headed {...mergeProps(api.getViewControlProps({ view }), props)} />;
}
