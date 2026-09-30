/**
 * Returns the content of a column's header, cell, aggregated cell or footer from its template.
 *
 * @remarks
 *   A template receives TanStack's context with `table` replaced by the table React renders the
 *   part with, a new object after every change of state. A template, or a compiled component it
 *   renders, therefore renders again after each change. A string template renders as written, and a
 *   function renders through `Rendered`, one component type for every template.
 */

import { type ReactNode } from "react";

import {
  type Cell,
  type CellContext,
  type Header,
  type HeaderContext,
  type RowData,
} from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { Rendered } from "#data-table/rendered.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes a column template: content as written, or a function of its context.
 *
 * @typeParam Context - Type of the context a function receives.
 */
export type Template<Context> = ((context: Context) => unknown) | string | undefined;

/**
 * Returns a template's content for a context.
 *
 * @typeParam Context - Type of the context a function receives.
 * @param template - The column's template.
 * @param context - The context a function receives.
 * @returns The content, or `null` for no template.
 */
export function renderedOf<Context>(template: Template<Context>, context: Context): ReactNode {
  if (typeof template === "function") return <Rendered context={context} render={template} />;

  return template ?? null;
}

/**
 * Returns a cell's content from its column's `cell` template.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table the part renders with.
 * @param cell - The cell to render.
 * @returns The template's content, or `null` for a column without one.
 */
export function cellContentOf<Row extends RowData>(
  table: DataTableApi<Row>,
  cell: Cell<Features, Row>,
): ReactNode {
  const context: CellContext<Features, Row> = { ...cell.getContext(), table };

  return renderedOf(cell.column.columnDef.cell, context);
}

/**
 * Returns an aggregated cell's content from its column's `aggregatedCell` template.
 *
 * @remarks
 *   TanStack's default template writes the aggregated value as a string, so a column that formats
 *   its figures states `aggregatedCell` as it states `cell`.
 * @typeParam Row - Type of one record.
 * @param table - The table the part renders with.
 * @param cell - The group row's cell to render.
 * @returns The template's content.
 */
export function aggregatedContentOf<Row extends RowData>(
  table: DataTableApi<Row>,
  cell: Cell<Features, Row>,
): ReactNode {
  const context: CellContext<Features, Row> = { ...cell.getContext(), table };

  return renderedOf(cell.column.columnDef.aggregatedCell, context);
}

/**
 * Returns a header's content from its column's `header` template.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table the part renders with.
 * @param header - The header to render.
 * @returns The template's content, or `null` for a column without one.
 */
export function headerContentOf<Row extends RowData>(
  table: DataTableApi<Row>,
  header: Header<Features, Row>,
): ReactNode {
  const context: HeaderContext<Features, Row> = { ...header.getContext(), table };

  return renderedOf(header.column.columnDef.header, context);
}

/**
 * Returns a footer's content from its column's `footer` template.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table the part renders with.
 * @param header - The header whose column's footer renders.
 * @returns The template's content, or `null` for a column without a footer.
 */
export function footerContentOf<Row extends RowData>(
  table: DataTableApi<Row>,
  header: Header<Features, Row>,
): ReactNode {
  const context: HeaderContext<Features, Row> = { ...header.getContext(), table };

  return renderedOf(header.column.columnDef.footer, context);
}
