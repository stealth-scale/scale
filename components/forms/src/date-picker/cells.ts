/**
 * Returns the machine's props for a cell and its trigger in the view the table belongs to.
 *
 * @remarks
 *   A day's cell takes a date, and a month's or a year's cell takes its number, so the view decides
 *   which of the machine's getters reads the cell. A day's trigger is named by its date in the
 *   locale, such as "Saturday, September 26, 2026", in place of the machine's English words. The
 *   grid cell reports its state: `aria-selected`, `aria-current="date"` for today, and
 *   `aria-disabled`.
 */

import { type DatePickerApi, type DateView } from "#date-picker/machine.ts";
import { type CellScope } from "#date-picker/scopes.ts";

/**
 * Describes the props the machine returns for an element.
 */
type ElementProps = ReturnType<DatePickerApi["getDayTableCellProps"]>;

/**
 * Returns the machine's props for a table cell.
 *
 * @param api - The machine's api, whose getter for the view reads the cell.
 * @param view - The view of the cell's table.
 * @param cell - The cell's value and state.
 * @returns The props of the `td` in the `gridcell` role.
 */
export function cellProps(api: DatePickerApi, view: DateView, cell: CellScope): ElementProps {
  const { value, ...rest } = cell;

  if (typeof value !== "number") return api.getDayTableCellProps({ ...rest, value });

  return view === "year"
    ? api.getYearTableCellProps({ ...rest, value })
    : api.getMonthTableCellProps({ ...rest, value });
}

/**
 * Returns the machine's props for the trigger in a table cell, a day's named by its date in the
 * locale.
 *
 * @param api - The machine's api, whose getter for the view reads the cell.
 * @param view - The view of the cell's table.
 * @param cell - The cell's value and state.
 * @returns The props of the element in the `button` role.
 */
export function cellTriggerProps(
  api: DatePickerApi,
  view: DateView,
  cell: CellScope,
): ElementProps {
  const { value, ...rest } = cell;

  if (typeof value !== "number") {
    const day = { ...rest, value };

    return {
      ...api.getDayTableCellTriggerProps(day),
      "aria-label": api.getDayTableCellState(day).valueText,
    };
  }

  return view === "year"
    ? api.getYearTableCellTriggerProps({ ...rest, value })
    : api.getMonthTableCellTriggerProps({ ...rest, value });
}
