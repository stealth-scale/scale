/**
 * Renders the button that moves the view on a month, a year or a decade.
 *
 * @remarks
 *   The button is named by `label`, "Next month", "Next year" or "Next decade" by its view. At the
 *   end `max` allows it reports `aria-disabled` and keeps focus. The glyph is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { type DateView, useDatePicker } from "#date-picker/machine.ts";
import { useView } from "#date-picker/scopes.ts";
import { stepped } from "#date-picker/steps.ts";

/**
 * Renders the `button` with the date picker's next trigger class.
 */
const Stepped = withContext("button", "nextTrigger");

/**
 * Accessible names of the button by view.
 */
const LABELS: Record<DateView, string> = {
  day: "Next month",
  month: "Next year",
  year: "Next decade",
};

/**
 * Describes the props of the next trigger: its name, its glyph and the props of a `button`.
 */
export interface NextTriggerProps extends ComponentProps<typeof Stepped> {
  /**
   * Accessible name of the button. Defaults to `Next month`, `Next year` or `Next decade` by the
   * view.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the next trigger with the machine's props for its view, named by `label`.
 *
 * @param props - The name, the glyph and the props of a `button`.
 * @returns The `button` element.
 */
export function NextTrigger({ label, ...props }: NextTriggerProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();

  return (
    <Stepped
      {...mergeProps(stepped(api.getNextTriggerProps({ view }), label ?? LABELS[view]), props)}
    />
  );
}
