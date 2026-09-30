/**
 * Renders the column manager: the columns a person can hide in a list they reorder, each with a box
 * that shows or hides it, and a button that restores the order and the visibility the table started
 * with.
 *
 * @remarks
 *   The list is the collections `Sortable` in its plain look, so a person moves a column by its
 *   handle with a pointer or with Space and the arrow keys, and each move is announced. Each row's
 *   box is the forms `Checkbox`, named by the column. The last visible column's box is disabled,
 *   so the table always shows a column of records. The reset button is a ghost button at the
 *   manager's end. The manager writes TanStack's `columnOrder` and `columnVisibility`. The caller
 *   places it, such as in a disclosure `Popover`.
 */

import { type ReactElement, type ReactNode } from "react";

import { Sortable } from "@stealthscale/component-collections";
import { Checkbox } from "@stealthscale/component-forms";

import { Reset } from "#data-table/bound.ts";
import { hideableOf, labelOf } from "#data-table/columns.ts";
import { withContext } from "#data-table/context.ts";
import { listedOf, reordered, visibleOf } from "#data-table/order.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Renders the `div` that stacks the list and the reset button.
 */
const Box = withContext("div", "manager");

/**
 * Describes the props of the column manager: the glyphs, the words and the sortable kit's words.
 */
export interface ColumnManagerProps extends Sortable.SortableWords {
  /**
   * Glyph inside a checked box, such as a check mark.
   */
  readonly checkIndicator?: ReactNode | undefined;

  /**
   * Glyph inside each row's handle, such as a grip.
   */
  readonly handleIndicator?: ReactNode | undefined;

  /**
   * Accessible name of the list. "Columns" unless stated.
   */
  readonly label?: string | undefined;

  /**
   * Words of the button that restores the order and the visibility. "Reset" unless stated.
   */
  readonly resetLabel?: string | undefined;
}

/**
 * Renders the column manager.
 *
 * @param props - The glyphs, the words and the sortable kit's words.
 * @returns The `div` around the list and the reset button.
 */
export function ColumnManager({
  checkIndicator,
  handleIndicator,
  label = "Columns",
  resetLabel = "Reset",
  ...words
}: ColumnManagerProps): ReactElement {
  const table = useTableState();
  const listed = listedOf(table);

  return (
    <Box>
      <Sortable.Root
        {...words}
        items={listed.map((column) => ({ id: column.id }))}
        onItemsChange={(next) => {
          const all = table.getAllLeafColumns().map((column) => column.id);

          table.setColumnOrder(
            reordered(
              all,
              next.map((item) => item.id),
            ),
          );
        }}
        variant="plain"
      >
        <Sortable.Items aria-label={label}>
          {listed.map((column, index) => (
            <Sortable.Item index={index} key={column.id} label={labelOf(column)} value={column.id}>
              <Sortable.Handle>{handleIndicator}</Sortable.Handle>
              <Checkbox.Root
                checked={visibleOf(table, column.id)}
                disabled={visibleOf(table, column.id) && !hideableOf(table, column)}
                onCheckedChange={(details) => {
                  column.toggleVisibility(details.checked === true);
                }}
                size="sm"
              >
                <Checkbox.Control>
                  <Checkbox.Indicator>{checkIndicator}</Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label>{labelOf(column)}</Checkbox.Label>
              </Checkbox.Root>
            </Sortable.Item>
          ))}
        </Sortable.Items>
      </Sortable.Root>
      <Reset
        onClick={() => {
          table.resetColumnOrder();
          table.resetColumnVisibility();
        }}
        size="sm"
        variant="ghost"
      >
        {resetLabel}
      </Reset>
    </Box>
  );
}
