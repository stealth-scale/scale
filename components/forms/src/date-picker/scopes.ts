/**
 * Provides the view, the table and the cell a part renders in to the parts inside it.
 *
 * @remarks
 *   A view's parts, its prev and next triggers and its tables, read which view they belong to, a
 *   table's cells read its view, and a cell's trigger reads the cell's value. Each throws for a
 *   part rendered outside its scope.
 */

import { type DateValue } from "@internationalized/date";

import { createRequiredContext } from "@stealthscale/hooks";

import { type DateView } from "#date-picker/machine.ts";

/**
 * Describes the view a part belongs to.
 */
export interface ViewScope {
  /**
   * View the part belongs to, which shows the days of a month, the months of a year or the years of
   * a decade.
   */
  readonly view: DateView;
}

/**
 * Describes the table a cell belongs to and the props the machine builds for it.
 */
export interface TableScope extends ViewScope {
  /**
   * Number of the table's columns, 7 for days and 4 for months or years by default.
   */
  readonly columns?: number | undefined;

  /**
   * ID the table's machine props are built from.
   */
  readonly id: string;
}

/**
 * Describes the days a table shows: its first and its last.
 */
export interface VisibleRange {
  /**
   * Last day the table shows.
   */
  readonly end: DateValue;

  /**
   * First day the table shows.
   */
  readonly start: DateValue;
}

/**
 * Describes the cell a cell trigger belongs to.
 */
export interface CellScope {
  /**
   * Whether the cell is disabled whatever the machine reads.
   */
  readonly disabled?: boolean | undefined;

  /**
   * The cell's date for the day view, else its month or year number.
   */
  readonly value: DateValue | number;

  /**
   * Range of days the table shows, for a table offset from the first visible month.
   */
  readonly visibleRange?: undefined | VisibleRange;
}

/**
 * Provides the view to the parts inside `DatePicker.View`, and reads it back.
 */
export const [ViewProvider, useView] = createRequiredContext<ViewScope>("DatePicker.View");

/**
 * Provides the table to the cells inside `DatePicker.Table`, and reads it back.
 */
export const [TableProvider, useTable] = createRequiredContext<TableScope>("DatePicker.Table");

/**
 * Provides the cell to the trigger inside `DatePicker.TableCell`, and reads it back.
 */
export const [CellProvider, useCell] = createRequiredContext<CellScope>("DatePicker.TableCell");
