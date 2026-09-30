/**
 * Renders the boxes of a column's value filter, which keeps the rows whose value is one of those
 * checked.
 *
 * @remarks
 *   The boxes are the forms `Checkbox` at size `sm` in a `Checkbox.Group`, one per faceted value in
 *   the order of the values' words. Each box is as wide as the panel, and its label ends in the
 *   number of rows that have the value, so the counts share a column at the rows' end. The
 *   filter's value is the array of the values checked, which `filterFn: "arrHas"` matches.
 *   Clearing every box removes the filter.
 */

import { type ReactElement, type ReactNode } from "react";

import { type Column, type RowData } from "@tanstack/react-table";

import { Checkbox } from "@stealthscale/component-forms";

import { Count, Value, ValueLabel } from "#data-table/bound.ts";
import { facetsOf, filterOf } from "#data-table/facets.ts";
import { type Features } from "#data-table/features.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Describes the props of a value filter: the column and the glyph of a checked box.
 */
export interface ValuesFilterProps {
  /**
   * Column the boxes filter.
   */
  readonly column: Column<Features, RowData>;

  /**
   * Glyph inside a checked box, such as a check mark.
   */
  readonly indicator?: ReactNode | undefined;
}

/**
 * Renders the value filter's boxes.
 *
 * @param props - The column and the glyph of a checked box.
 * @returns The checkbox group's `div`.
 */
export function ValuesFilter({ column, indicator }: ValuesFilterProps): ReactElement {
  const table = useTableState();
  const facets = facetsOf(table, column);
  const chosen = filterOf(table, column.id);

  return (
    <Checkbox.Group
      onValueChange={(checked) => {
        column.setFilterValue(
          facets.map(([value]) => value).filter((value) => checked.includes(String(value))),
        );
      }}
      size="sm"
      value={Array.isArray(chosen) ? chosen.map(String) : []}
    >
      {facets.map(([value, count]) => (
        <Value key={String(value)} value={String(value)}>
          <Checkbox.Control>
            <Checkbox.Indicator>{indicator}</Checkbox.Indicator>
          </Checkbox.Control>
          <ValueLabel>
            {String(value)} <Count>{count}</Count>
          </ValueLabel>
        </Value>
      ))}
    </Checkbox.Group>
  );
}
