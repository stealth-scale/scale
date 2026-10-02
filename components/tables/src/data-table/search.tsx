/**
 * Renders the search field that filters a data table's rows by any of their values.
 *
 * @remarks
 *   The field is the forms `SearchInput` on TanStack's global filter: every change filters the
 *   rows at once, Escape clears the field, and the table announces the count of matching rows. It
 *   takes the search input's props and axes, and a name through `aria-label` or a field's label.
 *   The field renders inside a `div` the recipe caps at `sizes.xs`, because the search input
 *   passes its props to its `input`, not to the box around it. The kit's select, expand and pin
 *   columns take no part in the search.
 */

import { type ReactElement } from "react";

import { SearchInput, type SearchInputProps } from "@stealthscale/component-forms";

import { withContext } from "#data-table/context.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Renders the `div` around the field with the recipe's search class.
 */
const Box = withContext("div", "search");

/**
 * Describes the props of the search field: the search input's props without its value, which the
 * table's global filter supplies.
 */
export type SearchProps = Omit<SearchInputProps, "defaultValue" | "onValueChange" | "value">;

/**
 * Renders the search field.
 *
 * @param props - The search input's props, its name included.
 * @returns The `div` around the search input.
 */
export function Search(props: SearchProps): ReactElement {
  const table = useTableState();
  const value: unknown = table.state.globalFilter;

  return (
    <Box>
      <SearchInput
        {...props}
        onValueChange={(next) => {
          table.setGlobalFilter(next);
        }}
        value={typeof value === "string" ? value : ""}
      />
    </Box>
  );
}
