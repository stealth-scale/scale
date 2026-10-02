/**
 * Writes the attributes a group's members element lays its members out by.
 */

import { COLUMNS } from "#form/recipe.ts";

/**
 * Describes the attributes the form's recipe reads off a group's members element.
 */
export interface Arrangement {
  /**
   * Set on a grid of a count of columns.
   */
  readonly "data-columns"?: "";

  /**
   * Set on a grid whose members do not fit at their natural width, which then lays them out in one
   * column.
   */
  readonly "data-crowded"?: "";

  /**
   * Set on a group whose members run across the page in a wrapping row.
   */
  readonly "data-direction"?: "row";

  /**
   * The count of columns, as the custom property the recipe reads, on a grid.
   */
  readonly style: Readonly<Record<string, string>>;
}

/**
 * Returns the attributes of a group's members element: a grid where the group states a count of
 * columns, a row where it states the row direction, and a column otherwise.
 *
 * @param columns - The count of columns the group states, or nothing.
 * @param direction - The direction the group states, or nothing.
 * @param crowded - Whether the members of a grid do not fit at their natural width.
 * @returns The data attributes and the style of the element.
 */
export function arrangementOf(
  columns: number | undefined,
  direction: "column" | "row" | undefined,
  crowded: boolean,
): Arrangement {
  if (columns !== undefined) {
    return {
      "data-columns": "",
      ...(crowded ? { "data-crowded": "" as const } : {}),
      style: { [COLUMNS]: String(columns) },
    };
  }

  return direction === "row" ? { "data-direction": "row", style: {} } : { style: {} };
}
