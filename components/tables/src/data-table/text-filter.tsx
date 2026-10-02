/**
 * Renders the field of a column's text filter, which keeps the rows whose value contains its text.
 *
 * @remarks
 *   The field is the forms `Input` at size `sm` on the column's filter value, a string that
 *   TanStack's `includesString` matches whatever its case. Emptying the field removes the filter.
 */

import { type ReactElement } from "react";

import { type Column, type RowData } from "@tanstack/react-table";

import { Input } from "@stealthscale/component-forms";

import { filterOf } from "#data-table/facets.ts";
import { type Features } from "#data-table/features.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Describes the props of a text filter: the column and the field's name.
 */
export interface TextFilterProps {
  /**
   * Column the field filters.
   */
  readonly column: Column<Features, RowData>;

  /**
   * Accessible name of the field.
   */
  readonly label: string;
}

/**
 * Renders the text filter's field.
 *
 * @param props - The column and the field's name.
 * @returns The `input` element.
 */
export function TextFilter({ column, label }: TextFilterProps): ReactElement {
  const table = useTableState();
  const value = filterOf(table, column.id);

  return (
    <Input
      aria-label={label}
      onChange={(event) => {
        column.setFilterValue(event.currentTarget.value);
      }}
      size="sm"
      value={typeof value === "string" ? value : ""}
    />
  );
}
