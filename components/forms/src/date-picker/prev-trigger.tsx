/**
 * Renders the button that moves the view back a month, a year or a decade.
 *
 * @remarks
 *   The button is named by `label`, "Previous month", "Previous year" or "Previous decade" by its
 *   view. At the start `min` allows it reports `aria-disabled` and keeps focus. The glyph is the
 *   caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { type DateView, useDatePicker } from "#date-picker/machine.ts";
import { useView } from "#date-picker/scopes.ts";
import { stepped } from "#date-picker/steps.ts";

/**
 * Renders the `button` with the date picker's previous trigger class.
 */
const Stepped = withContext("button", "prevTrigger");

/**
 * Accessible names of the button by view.
 */
const LABELS: Record<DateView, string> = {
  day: "Previous month",
  month: "Previous year",
  year: "Previous decade",
};

/**
 * Describes the props of the previous trigger: its name, its glyph and the props of a `button`.
 */
export interface PrevTriggerProps extends ComponentProps<typeof Stepped> {
  /**
   * Accessible name of the button. Defaults to "Previous month", "Previous year" or "Previous
   * decade" by the view.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the previous trigger with the machine's props for its view, named by `label`.
 *
 * @param props - The name, the glyph and the props of a `button`.
 * @returns The `button` element.
 */
export function PrevTrigger({ label, ...props }: PrevTriggerProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();

  return (
    <Stepped
      {...mergeProps(stepped(api.getPrevTriggerProps({ view }), label ?? LABELS[view]), props)}
    />
  );
}
