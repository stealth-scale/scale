/**
 * Renders the menu of a column's sort, grouping, pin and visibility, from a button in the column's
 * header.
 *
 * @remarks
 *   The button is the actions `IconButton` in the ghost look at size `xs`, with the caller's glyph,
 *   named by `label` for the column, and it opens the disclosure `Menu` under the header's start,
 *   or its end in a column of figures. Each row leads with the caller's glyph for its action, the
 *   icon the menu sizes one size smaller than the row. The menu lists only the actions that change
 *   the column: the sort directions the column is not sorted in and a clear while it is sorted, a
 *   group by the column while the column can group and an ungroup while it groups the rows, the
 *   regions it is not pinned to and an unpin while it is pinned, and a hide while another column a
 *   person can hide is visible. A column without any such action renders no button. A hide applies
 *   once the menu has left, and focus then moves to the menu button that takes the hidden column's
 *   place, or to the last one.
 */

import { Fragment, type ReactElement, type ReactNode, useRef } from "react";

import { ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { Menu } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

import {
  hideableOf,
  labelOf,
  placementOf,
  regionOf,
  sortOf,
  type TableColumn,
} from "#data-table/columns.ts";
import { hid, TRIGGER } from "#data-table/hidden.ts";
import { useTableState } from "#data-table/state.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes an action a column's menu lists.
 */
export type ColumnMenuAction =
  | "ascending"
  | "descending"
  | "end"
  | "grouped"
  | "hide"
  | "start"
  | "ungrouped"
  | "unpinned"
  | "unsorted";

/**
 * Describes the glyph each action's row leads with, by the action.
 */
export type ColumnMenuIndicators = Readonly<Partial<Record<ColumnMenuAction, ReactNode>>>;

/**
 * Describes the props of a column's menu: the column, the button's glyph and name, and the glyph
 * and the words of each action.
 */
export interface ColumnMenuProps {
  /**
   * Glyph each action's row leads with, such as an arrow for a sort. A row without one starts with
   * its words.
   */
  readonly actionIndicators?: ColumnMenuIndicators | undefined;

  /**
   * Words of the action that sorts the column ascending. "Sort ascending" unless stated.
   */
  readonly ascendingLabel?: string | undefined;

  /**
   * Column the menu acts on, which `DataTable.Table`'s `columnActions` receives.
   */
  readonly column: TableColumn;

  /**
   * Words of the action that sorts the column descending. "Sort descending" unless stated.
   */
  readonly descendingLabel?: string | undefined;

  /**
   * Words of the action that pins the column to the end. "Pin to end" unless stated.
   */
  readonly endLabel?: string | undefined;

  /**
   * Words of the action that groups the rows by the column. "Group by column" unless stated.
   */
  readonly groupedLabel?: string | undefined;

  /**
   * Words of the action that hides the column. "Hide column" unless stated.
   */
  readonly hideLabel?: string | undefined;

  /**
   * Glyph inside the button, such as three dots.
   */
  readonly indicator: ReactNode;

  /**
   * Returns the accessible name of the button from the column's name. "Options for Amount" unless
   * stated.
   */
  readonly label?: ((column: string) => string) | undefined;

  /**
   * Words of the action that pins the column to the start. "Pin to start" unless stated.
   */
  readonly startLabel?: string | undefined;

  /**
   * Words of the action that stops grouping the rows by the column. "Ungroup" unless stated.
   */
  readonly ungroupedLabel?: string | undefined;

  /**
   * Words of the action that unpins the column. "Unpin" unless stated.
   */
  readonly unpinnedLabel?: string | undefined;

  /**
   * Words of the action that clears the column's sort. "Clear sort" unless stated.
   */
  readonly unsortedLabel?: string | undefined;
}

/**
 * Returns the English name of a column's menu button.
 */
function optionsInEnglish(column: string): string {
  return `Options for ${column}`;
}

/**
 * Applies each action but the hide to a column.
 */
const APPLIED: Record<Exclude<ColumnMenuAction, "hide">, (column: TableColumn) => void> = {
  ascending: (column) => {
    column.toggleSorting(false);
  },
  descending: (column) => {
    column.toggleSorting(true);
  },
  end: (column) => {
    column.pin("end");
  },
  grouped: (column) => {
    column.toggleGrouping();
  },
  start: (column) => {
    column.pin("start");
  },
  ungrouped: (column) => {
    column.toggleGrouping();
  },
  unpinned: (column) => {
    column.pin(false);
  },
  unsorted: (column) => {
    column.clearSorting();
  },
};

/**
 * Returns the sort actions that change a column: the directions it is not sorted in, and a clear
 * while it is sorted.
 */
function sortingOf(table: DataTableApi, column: TableColumn): ColumnMenuAction[] {
  if (!column.getCanSort()) return [];

  const sorted = sortOf(table, column.id);
  const directions = (["ascending", "descending"] as const).filter((each) => each !== sorted);

  return sorted === undefined ? directions : [...directions, "unsorted"];
}

/**
 * Returns the grouping action that changes a column: an ungroup while the column groups the rows,
 * and a group by the column while it can group.
 */
function groupingOf(table: DataTableApi, column: TableColumn): ColumnMenuAction[] {
  if (table.state.grouping.includes(column.id)) return ["ungrouped"];

  return column.getCanGroup() ? ["grouped"] : [];
}

/**
 * Returns the pin actions that change a column: the regions it is not pinned to, and an unpin
 * while it is pinned.
 */
function pinningOf(table: DataTableApi, column: TableColumn): ColumnMenuAction[] {
  if (!column.getCanPin()) return [];

  const region = regionOf(table, column.id);
  const regions = (["start", "end"] as const).filter((each) => each !== region);

  return region === false ? regions : [...regions, "unpinned"];
}

/**
 * Returns the menu's groups of actions, each group apart from the next: sort, grouping, pin and
 * hide.
 */
function groupsOf(table: DataTableApi, column: TableColumn): ColumnMenuAction[][] {
  const hiding: ColumnMenuAction[] = hideableOf(table, column) ? ["hide"] : [];

  return [
    sortingOf(table, column),
    groupingOf(table, column),
    pinningOf(table, column),
    hiding,
  ].filter((group) => group.length > 0);
}

/**
 * Returns whether a value the menu reports is an action applied at once.
 */
function isApplied(value: string): value is Exclude<ColumnMenuAction, "hide"> {
  return Object.hasOwn(APPLIED, value);
}

/**
 * Returns the words of each action: the caller's, else the English ones.
 */
function wordsOf(props: ColumnMenuProps): Record<ColumnMenuAction, string> {
  return {
    ascending: props.ascendingLabel ?? "Sort ascending",
    descending: props.descendingLabel ?? "Sort descending",
    end: props.endLabel ?? "Pin to end",
    grouped: props.groupedLabel ?? "Group by column",
    hide: props.hideLabel ?? "Hide column",
    start: props.startLabel ?? "Pin to start",
    ungrouped: props.ungroupedLabel ?? "Ungroup",
    unpinned: props.unpinnedLabel ?? "Unpin",
    unsorted: props.unsortedLabel ?? "Clear sort",
  };
}

/**
 * Returns the menu's rows, each led by its action's glyph, a separator between two groups.
 */
function rowsOf(
  groups: ColumnMenuAction[][],
  words: Record<ColumnMenuAction, string>,
  indicators: ColumnMenuIndicators,
): ReactNode {
  return groups.map((group, index) => (
    <Fragment key={group[0]}>
      {index === 0 ? null : <Menu.Separator />}
      {group.map((action) => (
        <Menu.Item key={action} value={action}>
          {indicators[action]}
          {words[action]}
        </Menu.Item>
      ))}
    </Fragment>
  ));
}

/**
 * Renders the column's menu, or nothing for a column without an action that changes it.
 *
 * @param props - The column, the button's glyph and name, and the glyph and the words of each
 *   action.
 * @returns The menu's root, or `null`.
 */
export function ColumnMenu(props: ColumnMenuProps): null | ReactElement {
  const { actionIndicators = {}, column, indicator, label = optionsInEnglish } = props;
  const table = useTableState();
  const trigger = useRef<HTMLButtonElement>(null);
  const hiding = useRef(false);
  const groups = groupsOf(table, column);

  if (groups.length === 0) return null;

  return (
    <Menu.Root
      onExitComplete={() => {
        if (!hiding.current) return;

        hiding.current = false;
        queueMicrotask(() => {
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the menu opened from its button, which is mounted
          hid(column, trigger.current as HTMLButtonElement);
        });
      }}
      onSelect={({ value }) => {
        if (isApplied(value)) APPLIED[value](column);
        else hiding.current = true;
      }}
      positioning={{ placement: placementOf(column) }}
    >
      <ButtonPropsProvider value={{ size: "xs", variant: "ghost" }}>
        <Menu.Trigger
          aria-label={label(labelOf(column))}
          as={IconButton}
          ref={trigger}
          {...{ [TRIGGER]: "" }}
        >
          {indicator}
        </Menu.Trigger>
      </ButtonPropsProvider>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>{rowsOf(groups, wordsOf(props), actionIndicators)}</Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
