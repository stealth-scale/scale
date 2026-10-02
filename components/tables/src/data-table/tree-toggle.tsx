/**
 * Renders the toggle that opens and closes a row's sub-rows, in the tree column's cell or a group
 * row's grouped cell.
 *
 * @remarks
 *   The button is the actions `IconButton` in the ghost look at size `xs`, out of the tab order,
 *   because the row takes the keys that open and close it. Its name is the action a press takes,
 *   "Expand" or "Collapse" unless the caller states others. The caller's glyph points to the inline
 *   end and turns a quarter while the row is open. A press opens or closes the row and focuses it,
 *   so the arrows continue from the row.
 */

import { type ReactElement } from "react";

import { IconButton } from "@stealthscale/component-actions";

import { ExpandIndicator } from "#data-table/bound.ts";
import { type Branches } from "#data-table/levels.ts";
import { expandedOf } from "#data-table/rows.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Describes the props of a row's toggle: the row, and the words and the glyph of the toggles.
 */
export interface TreeToggleProps {
  /**
   * Words and glyph of the toggles.
   */
  readonly branches: Branches;

  /**
   * Id of the row the toggle opens and closes.
   */
  readonly id: string;
}

/**
 * Renders the row's toggle, named by the action a press takes.
 *
 * @param props - The row's id, and the words and the glyph of the toggles.
 * @returns The `button` element.
 */
export function TreeToggle({ branches, id }: TreeToggleProps): ReactElement {
  const table = useTableState();
  const open = expandedOf(table, id);

  return (
    <IconButton
      aria-label={open ? branches.collapseLabel : branches.expandLabel}
      onClick={(event) => {
        table.getRow(id).toggleExpanded();
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the toggle renders inside its row
        (event.currentTarget.closest("tr") as HTMLTableRowElement).focus();
      }}
      size="xs"
      tabIndex={-1}
      variant="ghost"
    >
      <ExpandIndicator aria-hidden data-state={open ? "open" : "closed"}>
        {branches.indicator}
      </ExpandIndicator>
    </IconButton>
  );
}
