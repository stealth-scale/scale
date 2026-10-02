/**
 * Renders the button that opens and closes a row's detail, in the expand column's cell.
 *
 * @remarks
 *   The button is the actions `IconButton`, named by the caller's label for the row. It states
 *   `aria-expanded`, and `aria-controls` at the detail row while the detail is open, because the
 *   detail row renders only then. The caller's glyph points to the inline end and turns a quarter
 *   while the detail is open. The button is in a box whose negative block margin keeps its row as
 *   tall as a row of text. A row that cannot expand renders no button, and neither does a row with
 *   sub-rows, whose toggle opens its sub-rows in place of a detail.
 */

import { type ReactElement, type ReactNode } from "react";

import { IconButton } from "@stealthscale/component-actions";

import { ExpandIndicator, Toggle } from "#data-table/bound.ts";
import { detailableOf, detailIdOf, expandedOf } from "#data-table/rows.ts";
import { useIdPrefix, useTableState } from "#data-table/state.ts";

/**
 * Describes the props of a row's detail toggle: the row, its name and its glyph.
 */
export interface ExpandCellProps {
  /**
   * Id of the row whose detail the button opens.
   */
  readonly id: string;

  /**
   * Glyph inside the button, pointing to the inline end, such as a chevron.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * Accessible name of the button, such as "Details of Halden Freight".
   */
  readonly label: string;
}

/**
 * Renders the row's detail toggle, or nothing for a row that cannot expand.
 *
 * @param props - The row's id, the button's name and the glyph.
 * @returns The `span` around the `button` element, or `null`.
 */
export function ExpandCell({ id, indicator, label }: ExpandCellProps): null | ReactElement {
  const table = useTableState();
  const prefix = useIdPrefix();
  const open = expandedOf(table, id);

  if (!detailableOf(table, id)) return null;

  return (
    <Toggle>
      <IconButton
        aria-controls={open ? detailIdOf(prefix, id) : undefined}
        aria-expanded={open}
        aria-label={label}
        onClick={() => {
          table.getRow(id).toggleExpanded();
        }}
        size="xs"
        variant="ghost"
      >
        <ExpandIndicator aria-hidden data-state={open ? "open" : "closed"}>
          {indicator}
        </ExpandIndicator>
      </IconButton>
    </Toggle>
  );
}
