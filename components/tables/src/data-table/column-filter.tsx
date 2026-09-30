/**
 * Renders a column's filter: a button in the column's header that opens a panel with the filter
 * the column's `meta.filter` names.
 *
 * @remarks
 *   The button is the actions `IconButton` at size `xs` in the ghost look with the caller's glyph,
 *   named by `label` for the column and the filter's state. While the column filters, the button
 *   states `data-pressed`, which renders the button's on state, `Highlight` under forced colours,
 *   without the toggle semantics of `aria-pressed`. It opens the disclosure `Popover` at size `sm`
 *   under the header's start, or its end in a column of figures. The panel is `sizes.60` wide and
 *   named by its title, with the field of a `text` filter, the boxes of a `select` filter or the
 *   two fields of a `range` filter at size `sm`, and a ghost button at its end that clears the
 *   filter. A menu cannot contain fields, so the filter is a popover, as the filter panels of Ant
 *   Design and MUI are. A column without `meta.filter`, or one that cannot filter, renders no
 *   button.
 */

import { type ReactElement, type ReactNode } from "react";

import { ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { Popover } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

import { Panel, Reset } from "#data-table/bound.ts";
import { labelOf, placementOf, type TableColumn } from "#data-table/columns.ts";
import { filterOf } from "#data-table/facets.ts";
import { FilterFields } from "#data-table/filter-fields.tsx";
import { useTableState } from "#data-table/state.ts";

/**
 * Describes the props of a column's filter: the column, the glyphs and the words.
 */
export interface ColumnFilterProps {
  /**
   * Glyph inside a checked box of a `select` filter, such as a check mark.
   */
  readonly checkIndicator?: ReactNode | undefined;

  /**
   * Words of the button that clears the filter. "Clear" unless stated.
   */
  readonly clearLabel?: string | undefined;

  /**
   * Column the filter acts on, which `DataTable.Table`'s `columnActions` receives.
   */
  readonly column: TableColumn;

  /**
   * Glyph inside the button, such as a funnel.
   */
  readonly indicator: ReactNode;

  /**
   * Returns the accessible name of the button from the column's name and whether the column
   * filters, and the panel's title while `active` is false. "Filter Amount" and "Filter Amount,
   * active" unless stated.
   */
  readonly label?: ((column: string, active: boolean) => string) | undefined;

  /**
   * Label of a `range` filter's field for the maximum. "Maximum" unless stated.
   */
  readonly maxLabel?: string | undefined;

  /**
   * Label of a `range` filter's field for the minimum. "Minimum" unless stated.
   */
  readonly minLabel?: string | undefined;
}

/**
 * Returns the English name of a filter's button.
 */
function filterInEnglish(column: string, active: boolean): string {
  return active ? `Filter ${column}, active` : `Filter ${column}`;
}

/**
 * Renders the column's filter, or nothing for a column without one.
 *
 * @param props - The column, the glyphs and the words.
 * @returns The popover's root, or `null`.
 */
export function ColumnFilter({
  checkIndicator,
  clearLabel = "Clear",
  column,
  indicator,
  label = filterInEnglish,
  maxLabel = "Maximum",
  minLabel = "Minimum",
}: ColumnFilterProps): null | ReactElement {
  const table = useTableState();
  const active = filterOf(table, column.id) !== undefined;
  const name = labelOf(column);
  const title = label(name, false);

  if (column.columnDef.meta?.filter === undefined || !column.getCanFilter()) return null;

  return (
    <Popover.Root positioning={{ placement: placementOf(column) }} size="sm">
      <ButtonPropsProvider value={{ size: "xs", variant: "ghost" }}>
        <Popover.Trigger
          aria-label={label(name, active)}
          as={IconButton}
          {...(active ? { "data-pressed": "" } : {})}
        >
          {indicator}
        </Popover.Trigger>
      </ButtonPropsProvider>
      <Portal>
        <Popover.Positioner>
          <Panel>
            <Popover.Title>{title}</Popover.Title>
            <FilterFields
              checkIndicator={checkIndicator}
              column={column}
              maxLabel={maxLabel}
              minLabel={minLabel}
              title={title}
            />
            <Reset
              onClick={() => {
                column.setFilterValue(undefined);
              }}
              size="sm"
              variant="ghost"
            >
              {clearLabel}
            </Reset>
          </Panel>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
