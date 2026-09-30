/**
 * Resizes a column from the keys a focused resize separator receives.
 *
 * @remarks
 *   The keys follow the WAI-ARIA window splitter pattern: ArrowLeft and ArrowRight narrow and widen
 *   the column by 16px, reversed while the table's `columnResizeDirection` is `rtl`, where the
 *   column's end is on its left. A pointer's drag reads the same option. Home sets the column's
 *   minimum, End its maximum, and Enter restores the size the column states. The size remains
 *   within the column's minimum and maximum, TanStack's 20px and `Number.MAX_SAFE_INTEGER` for a
 *   column that states neither. End resizes nothing on a column that states no maximum, because a
 *   column `Number.MAX_SAFE_INTEGER` pixels wide is wider than a browser lays out.
 */

import { type KeyboardEvent } from "react";

import { type Column, type RowData } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Width in pixels an arrow key adds to a column or takes from it.
 */
export const STEP = 16;

/**
 * Describes the smallest and the largest size of a column, in pixels.
 */
export interface Bounds {
  /**
   * Largest size.
   */
  readonly max: number;

  /**
   * Smallest size.
   */
  readonly min: number;
}

/**
 * Describes the bounds a column's definition may state.
 */
export interface Stated {
  /**
   * Largest size in pixels, if stated.
   */
  readonly maxSize?: number | undefined;

  /**
   * Smallest size in pixels, if stated.
   */
  readonly minSize?: number | undefined;
}

/**
 * Returns the bounds a column's definition states, TanStack's defaults for a bound it leaves out.
 *
 * @param definition - The column's sizes.
 * @returns The bounds in pixels.
 */
export function boundsOf(definition: Stated): Bounds {
  return {
    max: definition.maxSize ?? Number.MAX_SAFE_INTEGER,
    min: definition.minSize ?? 20,
  };
}

/**
 * Returns the size a key sets, or undefined for a key that resizes nothing.
 *
 * @param key - The key pressed.
 * @param size - The column's size now.
 * @param bounds - The column's smallest and largest size.
 * @param rtl - Whether the table runs right to left.
 */
function sizeFor(key: string, size: number, bounds: Bounds, rtl: boolean): number | undefined {
  const wider = rtl ? "ArrowLeft" : "ArrowRight";
  const narrower = rtl ? "ArrowRight" : "ArrowLeft";
  const next = {
    End: bounds.max === Number.MAX_SAFE_INTEGER ? undefined : bounds.max,
    Home: bounds.min,
    [narrower]: size - STEP,
    [wider]: size + STEP,
  }[key];

  return next === undefined ? undefined : Math.min(bounds.max, Math.max(bounds.min, next));
}

/**
 * Resizes the column for a key pressed on its separator, and cancels the key's default.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose sizes change.
 * @param column - The column the separator resizes.
 * @param event - The key the separator received, whose default a handled key cancels.
 */
export function resizedByKey<Row extends RowData>(
  table: DataTableApi<Row>,
  column: Column<Features, Row>,
  event: KeyboardEvent<HTMLElement>,
): void {
  if (event.key === "Enter") {
    event.preventDefault();
    column.resetSize();

    return;
  }

  const rtl = table.options.columnResizeDirection === "rtl";
  const size = sizeFor(event.key, column.getSize(), boundsOf(column.columnDef), rtl);

  if (size === undefined) return;

  event.preventDefault();
  table.setColumnSizing((sizes) => ({ ...sizes, [column.id]: size }));
}
