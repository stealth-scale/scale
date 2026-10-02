/**
 * Renders the fields of the filter a column's `meta.filter` names: the field of a `text` filter,
 * the boxes of a `select` filter or the two fields of a `range` filter.
 */

import { type ReactElement, type ReactNode } from "react";

import { type Column, type RowData } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { RangeFilter } from "#data-table/range-filter.tsx";
import { TextFilter } from "#data-table/text-filter.tsx";
import { ValuesFilter } from "#data-table/values-filter.tsx";

/**
 * Describes the props of a filter's fields: the column, the glyph of a checked box and the words.
 */
export interface FilterFieldsProps {
  /**
   * Glyph inside a checked box of a `select` filter.
   */
  readonly checkIndicator?: ReactNode | undefined;

  /**
   * Column the fields filter.
   */
  readonly column: Column<Features, RowData>;

  /**
   * Label of a `range` filter's field for the maximum.
   */
  readonly maxLabel: string;

  /**
   * Label of a `range` filter's field for the minimum.
   */
  readonly minLabel: string;

  /**
   * Accessible name of a `text` filter's field, the panel's title.
   */
  readonly title: string;
}

/**
 * Renders the fields of the column's filter.
 *
 * @param props - The column, the glyph of a checked box and the words.
 * @returns The fields of a `text` or a `select` filter, and a `range` filter's otherwise.
 */
export function FilterFields(props: FilterFieldsProps): ReactElement {
  const { checkIndicator, column, maxLabel, minLabel, title } = props;
  const variant = column.columnDef.meta?.filter;

  if (variant === "text") return <TextFilter column={column} label={title} />;

  if (variant === "select") return <ValuesFilter column={column} indicator={checkIndicator} />;

  return <RangeFilter column={column} maxLabel={maxLabel} minLabel={minLabel} />;
}
