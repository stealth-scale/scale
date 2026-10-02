/**
 * Renders the button that moves the panel up a view: from the days to the months, and from the
 * months to the years.
 *
 * @remarks
 *   The button contains the view's range text. It is named by that text followed by `label`,
 *   "Choose month" or "Choose year" by its view, so its name starts with the words it shows. The
 *   machine disables it where no view is above, and there it is named by its text alone.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#date-picker/context.ts";
import { type DateView, useDatePicker } from "#date-picker/machine.ts";
import { useView } from "#date-picker/scopes.ts";
import { visibleText } from "#date-picker/texts.ts";

/**
 * Renders the `button` with the date picker's view trigger class.
 */
const Switched = withContext("button", "viewTrigger");

/**
 * Words after the range text in the button's name, by view.
 */
const LABELS: Partial<Record<DateView, string>> = { day: "Choose month", month: "Choose year" };

/**
 * Describes the props of the view trigger: the words of its name, its range text and the props of
 * a `button`.
 */
export interface ViewTriggerProps extends ComponentProps<typeof Switched> {
  /**
   * Words after the range text in the button's name. Defaults to `Choose month` or `Choose year` by
   * the view.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the view trigger with the machine's props for its view, named by its text and `label`.
 *
 * @param props - The words, the range text and the props of a `button`.
 * @returns The `button` element.
 */
export function ViewTrigger({ label, ...props }: ViewTriggerProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();
  const { "aria-label": _label, ...machine }: ViewTriggerProps = {
    ...api.getViewTriggerProps({ view }),
  };
  const words = label ?? LABELS[view];
  const own = omitUndefined({
    "aria-label":
      words === undefined || machine.disabled === true
        ? undefined
        : `${visibleText(api)}, ${words}`,
  });

  return <Switched {...mergeProps(machine, own, props)} />;
}
