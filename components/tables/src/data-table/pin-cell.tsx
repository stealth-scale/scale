/**
 * Renders the toggle that pins a row to a region of the body, in the pin column's cell.
 *
 * @remarks
 *   The button is the actions `IconButton`, named by the caller's label for the row. It states
 *   `aria-pressed` while the row is pinned to the column's region: a press pins the row there, and
 *   a second press unpins it. A row pinned to the other region is not pressed, and a press moves
 *   it. A row the table does not let pin renders no button. A press moves the row, and the
 *   element of a row that moves into another row group renders anew, so focus moves to the
 *   toggle at the row's new place once the table has rendered the move. The button is in a box
 *   whose negative block margin keeps its row as tall as a row of text.
 */

import { type ReactElement, type ReactNode } from "react";
import { flushSync } from "react-dom";

import { IconButton } from "@stealthscale/component-actions";

import { Toggle } from "#data-table/bound.ts";
import { pinIdOf, pinnableOf, pinOf } from "#data-table/rows.ts";
import { useIdPrefix, useTableState } from "#data-table/state.ts";

/**
 * Describes the props of a row's pin toggle: the row, the region, its name and its glyph.
 */
export interface PinCellProps {
  /**
   * Id of the row the button pins.
   */
  readonly id: string;

  /**
   * Glyph inside the button, such as a pin.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * Accessible name of the button, such as "Pin Halden Freight".
   */
  readonly label: string;

  /**
   * Region a press pins the row to.
   */
  readonly position: "bottom" | "top";
}

/**
 * Renders the row's pin toggle, or nothing for a row that cannot pin.
 *
 * @param props - The row's id, the region, the button's name and the glyph.
 * @returns The `span` around the `button` element, or `null`.
 */
export function PinCell({ id, indicator, label, position }: PinCellProps): null | ReactElement {
  const table = useTableState();
  const prefix = useIdPrefix();
  const own = pinIdOf(prefix, id);
  const pinned = pinOf(table, id) === position;

  if (!pinnableOf(table, id)) return null;

  return (
    <Toggle>
      <IconButton
        aria-label={label}
        aria-pressed={pinned}
        id={own}
        onClick={(event) => {
          const { ownerDocument } = event.currentTarget;

          flushSync(() => {
            table.getRow(id).pin(pinned ? false : position);
          });
          ownerDocument.querySelector<HTMLElement>(`[id="${own}"]`)?.focus();
        }}
        size="xs"
        variant="ghost"
      >
        {indicator}
      </IconButton>
    </Toggle>
  );
}
