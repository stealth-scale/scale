/**
 * Renders the browser's select of the years, which moves the view to the chosen year.
 *
 * @remarks
 *   The element is named by `label`, "Year" by default, and lists the years `min` and `max`
 *   allow, or a range around the focused date without them. The machine keeps its value on the
 *   first visible month's year.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";

/**
 * Renders the `select` with the date picker's year select class.
 */
const Chosen = withContext("select", "yearSelect");

/**
 * Describes the props of the year select: its name and the props of a `select`.
 */
export interface YearSelectProps extends Omit<ComponentProps<typeof Chosen>, "children"> {
  /**
   * Accessible name of the select. Defaults to `Year`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the select with the machine's year select props and an option per year.
 *
 * @param props - The name and the props of a `select`.
 * @returns The `select` element.
 */
export function YearSelect({ label = "Year", ...props }: YearSelectProps): ReactElement {
  const api = useDatePicker();

  return (
    <Chosen {...mergeProps(api.getYearSelectProps(), { "aria-label": label }, props)}>
      {api.getYears().map((year) => (
        <option disabled={year.disabled} key={year.value} value={year.value}>
          {year.label}
        </option>
      ))}
    </Chosen>
  );
}
