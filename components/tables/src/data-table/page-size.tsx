/**
 * Renders the browser's `select` that sets how many rows a data table shows on a page.
 *
 * @remarks
 *   The part is the forms `NativeSelect` with an option per size in `sizes`, and its value is the
 *   table's page size, which is one of `sizes`. A choice sets TanStack's page size, which keeps the
 *   first row of the page in view. With `label` the part renders the words in a `label` before the
 *   select, in a row, as the page size choice of MUI's table pagination does. Without it the label
 *   of a `Field` around the part names the select, and the select takes the field's size.
 */

import { type ReactElement, type ReactNode, useId } from "react";

import { NativeSelect } from "@stealthscale/component-forms";

import { withContext } from "#data-table/context.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Renders the `div` that lays the label and the select out in a row.
 */
const Row = withContext("div", "pageSize");

/**
 * Renders the `label` of the select.
 */
const Label = withContext("label", "pageSizeLabel");

/**
 * Describes the props of the page size select: the sizes, the label, the glyph and the props of
 * the native select's box.
 */
export interface PageSizeProps extends Omit<NativeSelect.RootProps, "children"> {
  /**
   * Glyph at the select's end, such as a chevron.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * Words of the label before the select, such as "Rows per page", for a select outside a `Field`.
   */
  readonly label?: string | undefined;

  /**
   * Sizes a person chooses from, in the order the options list them.
   */
  readonly sizes: readonly number[];
}

/**
 * Renders the select on the table's page size, after its label when one is given.
 *
 * @param props - The sizes, the label, the glyph and the props of the native select's box.
 * @returns The row of the label and the select, or the native select's box alone.
 */
export function PageSize({ indicator, label, sizes, ...props }: PageSizeProps): ReactElement {
  const table = useTableState();
  const id = useId();
  const { pageSize } = table.state.pagination;
  const select = (
    <NativeSelect.Root {...props}>
      <NativeSelect.Field
        {...(label === undefined ? {} : { id })}
        onChange={(event) => {
          table.setPageSize(Number(event.currentTarget.value));
        }}
        value={String(pageSize)}
      >
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </NativeSelect.Field>
      {indicator === undefined ? null : (
        <NativeSelect.Indicator>{indicator}</NativeSelect.Indicator>
      )}
    </NativeSelect.Root>
  );

  if (label === undefined) return select;

  return (
    <Row>
      <Label htmlFor={id}>{label}</Label>
      {select}
    </Row>
  );
}
