/**
 * Renders the two fields of a column's range filter, which keeps the rows whose figure is between
 * a minimum and a maximum.
 *
 * @remarks
 *   The fields are the forms `NumberInput` inside a `Field` each at size `sm`, labelled by the
 *   words for the minimum and the maximum, with the least and the greatest faceted figures as
 *   placeholders. The
 *   filter's value is the two ends, which TanStack's `inNumberRange` reads with an empty end open.
 *   Emptying both fields removes the filter.
 */

import { type ReactElement } from "react";

import { type Column, type RowData } from "@tanstack/react-table";

import { Field, NumberInput } from "@stealthscale/component-forms";

import { withContext } from "#data-table/context.ts";
import { endsOf, extentOf, filterOf } from "#data-table/facets.ts";
import { type Features } from "#data-table/features.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Renders the `div` that lays the two fields out side by side.
 */
const Ends = withContext("div", "range");

/**
 * Describes the props of a range filter: the column and the words of its two fields.
 */
export interface RangeFilterProps {
  /**
   * Column the fields filter.
   */
  readonly column: Column<Features, RowData>;

  /**
   * Label of the field for the maximum.
   */
  readonly maxLabel: string;

  /**
   * Label of the field for the minimum.
   */
  readonly minLabel: string;
}

/**
 * Returns a figure a field reports, or undefined for an empty field.
 */
function figureOf(value: number): number | undefined {
  return Number.isNaN(value) ? undefined : value;
}

/**
 * Returns a field's text for an end, empty while the end is open.
 */
function textOf(end: number | undefined): string {
  return end === undefined ? "" : String(end);
}

/**
 * Renders the range filter's two fields.
 *
 * @param props - The column and the words of its two fields.
 * @returns The `div` around the fields.
 */
export function RangeFilter({ column, maxLabel, minLabel }: RangeFilterProps): ReactElement {
  const table = useTableState();
  const [low, high] = endsOf(filterOf(table, column.id));
  const extent = extentOf(table, column);

  return (
    <Ends>
      <Field.Root size="sm">
        <Field.Label>{minLabel}</Field.Label>
        <NumberInput.Root
          onValueChange={({ valueAsNumber }) => {
            column.setFilterValue([figureOf(valueAsNumber), high]);
          }}
          value={textOf(low)}
        >
          <NumberInput.Input placeholder={textOf(extent?.[0])} />
        </NumberInput.Root>
      </Field.Root>
      <Field.Root size="sm">
        <Field.Label>{maxLabel}</Field.Label>
        <NumberInput.Root
          onValueChange={({ valueAsNumber }) => {
            column.setFilterValue([low, figureOf(valueAsNumber)]);
          }}
          value={textOf(high)}
        >
          <NumberInput.Input placeholder={textOf(extent?.[1])} />
        </NumberInput.Root>
      </Field.Root>
    </Ends>
  );
}
