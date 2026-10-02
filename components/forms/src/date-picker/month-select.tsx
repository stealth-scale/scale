/**
 * Renders the browser's select of the months, which moves the view to the chosen month.
 *
 * @remarks
 *   The element is named by `label`, "Month" by default, and lists the months in the locale, those
 *   outside `min` and `max` disabled. The machine keeps its value on the first visible month.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";

/**
 * Renders the `select` with the date picker's month select class.
 */
const Chosen = withContext("select", "monthSelect");

/**
 * Describes the props of the month select: its name and the props of a `select`.
 */
export interface MonthSelectProps extends Omit<ComponentProps<typeof Chosen>, "children"> {
  /**
   * Accessible name of the select. Defaults to `Month`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the select with the machine's month select props and an option per month.
 *
 * @param props - The name and the props of a `select`.
 * @returns The `select` element.
 */
export function MonthSelect({ label = "Month", ...props }: MonthSelectProps): ReactElement {
  const api = useDatePicker();

  return (
    <Chosen {...mergeProps(api.getMonthSelectProps(), { "aria-label": label }, props)}>
      {api.getMonths({ format: "long" }).map((month) => (
        <option disabled={month.disabled} key={month.value} value={month.value}>
          {month.label}
        </option>
      ))}
    </Chosen>
  );
}
