/**
 * Draws a whole listbox from what it is told about the list, rather than from parts a caller
 * composes.
 *
 * @remarks
 *   Almost every list is the same shape: a label, a field or a select-all row above the rows, the
 *   rows, and something said where there are none. Composing that by hand is a page of code per
 *   list and a chance to leave out the empty part or the label every time. This draws it from
 *   props, and a list that wants something else composes the parts instead, which are published
 *   beside this and are what this is built from.
 *   Narrowing stays the caller's. The field reports what was typed and the caller hands back a
 *   collection holding what is left, because the machine never filters and a component that did
 *   would hold two lists and disagree with itself.
 *   A name given as `aria-label` goes on the rows rather than on the frame round them, and only
 *   where the list carries no label of its own. The rows are the listbox as far as a screen reader
 *   is concerned, a name on the frame names something with no role at all, and a name beside a
 *   label a reader can see is the one a reader cannot see winning.
 */

import { type ReactElement, type ReactNode } from "react";

import { type ListCollection } from "@zag-js/collection";

import {
  Content,
  type ContentProps,
  Empty,
  Input,
  type InputProps,
  ItemGroup,
  ItemGroupLabel,
  Label,
  Root,
  type RootProps,
  SelectAll,
  ValueText,
  Window,
} from "#listbox/parts.ts";
import { ROW_HEIGHT } from "#listbox/recipe.ts";
import { Row } from "#listbox/row.tsx";

/**
 * Describes the field a reader narrows the list from.
 */
export interface Narrowing {
  /**
   * Drawn inside the control that empties the field, which is drawn only where one is given.
   */
  readonly clearIndicator?: ReactNode | undefined;

  /**
   * Reads out as the name of the control that empties the field.
   */
  readonly clearLabel?: string | undefined;

  /**
   * Hears what was typed, so the caller hands back a collection holding what is left.
   */
  readonly onNarrow: (typed: string) => void;

  /**
   * Drawn in the field while it is empty.
   */
  readonly placeholder?: string | undefined;
}

/**
 * Describes what a whole listbox takes beyond everything its root takes.
 *
 * @typeParam Row - What one row holds.
 */
export interface SimpleProps<Row> extends Omit<RootProps, "children" | "collection"> {
  /**
   * The rows, in the order they are drawn.
   */
  readonly collection: ListCollection<Row>;

  /**
   * Written under a row's name, for a name that does not tell a reader enough to choose.
   */
  readonly description?: ((row: Row) => ReactNode) | undefined;

  /**
   * Said where the list holds nothing at all.
   */
  readonly empty?: ReactNode | undefined;

  /**
   * Reads the heading a row is gathered under, for a list drawn in groups.
   */
  readonly groupBy?: ((row: Row) => string) | undefined;

  /**
   * Reads the words a heading is drawn by, where they are not the heading's own key.
   */
  readonly groupLabel?: ((under: string) => ReactNode) | undefined;

  /**
   * Drawn before a row's name, saying what kind of thing the row is.
   */
  readonly icon?: ((row: Row) => ReactNode) | undefined;

  /**
   * Words above the list naming it.
   */
  readonly label?: ReactNode | undefined;

  /**
   * A field above the rows that narrows them as a reader types.
   */
  readonly narrowing?: Narrowing | undefined;

  /**
   * Words on a row above the list that turns the whole of it on.
   */
  readonly selectAll?: ReactNode | undefined;

  /**
   * Written under the list, following whatever is picked. The words stand in while nothing is.
   */
  readonly summary?: string | undefined;

  /**
   * How many rows tall the list is. A list told this draws only the rows near enough to be seen,
   * whatever the collection holds.
   */
  readonly tall?: number | undefined;
}

/**
 * Describes what drawing one row needs beyond the row.
 *
 * @typeParam Row - What one row holds.
 */
type Drawing<Row> = Pick<SimpleProps<Row>, "collection" | "description" | "icon">;

/**
 * Draws one row of the list.
 *
 * @typeParam Row - What one row holds.
 */
function drawn<Row>({ collection, description, icon }: Drawing<Row>, row: Row): ReactElement {
  return (
    <Row
      {...(description === undefined ? {} : { description: description(row) })}
      {...(icon === undefined ? {} : { icon: icon(row) })}
      item={row}
      key={collection.getItemValue(row)}
    >
      {collection.stringifyItem(row)}
    </Row>
  );
}

/**
 * Gathers the rows under their headings, in the order the headings first appear.
 *
 * @typeParam Row - What one row holds.
 */
function gathered<Row>(rows: readonly Row[], under: (row: Row) => string): Map<string, Row[]> {
  const groups = new Map<string, Row[]>();

  for (const row of rows) {
    const key = under(row);

    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return groups;
}

/**
 * Draws the rows, gathered under headings where the list is told how to gather them.
 *
 * @typeParam Row - What one row holds.
 */
function listed<Row>(props: SimpleProps<Row>, rows: readonly Row[]): ReactNode {
  const { groupBy, groupLabel } = props;

  if (groupBy === undefined) return rows.map((row) => drawn(props, row));

  return [...gathered(rows, groupBy)].map(([under, held]) => (
    <ItemGroup id={under} key={under}>
      <ItemGroupLabel htmlFor={under}>{groupLabel?.(under) ?? under}</ItemGroupLabel>
      {held.map((row) => drawn(props, row))}
    </ItemGroup>
  ));
}

/**
 * Writes what the field takes out of what the list was told about narrowing.
 *
 * @remarks
 *   The two differ by one name. A list hears what was typed through `onNarrow`, because what it
 *   does with the text is hand back a shorter collection, and the field reports it through the name
 *   every driven field in this house reports a value under.
 */
function narrowed({ onNarrow, ...rest }: Narrowing): InputProps {
  return { ...rest, onValueChange: onNarrow };
}

/**
 * Writes what the box holding the rows takes: the name, where the list carries no label to take it
 * from, and the room it stands in, where the list is held to a count of rows.
 *
 * @typeParam Row - What one row holds.
 */
function boxed<Row>({ "aria-label": named, label, tall }: SimpleProps<Row>): ContentProps {
  return {
    ...(label === undefined && named !== undefined ? { "aria-label": named } : {}),
    ...(tall === undefined
      ? {}
      : { style: { blockSize: `calc(var(${ROW_HEIGHT}) * ${String(tall)})` } }),
  };
}

/**
 * Draws a whole listbox from what it is told about the list.
 *
 * @typeParam Row - What one row holds.
 * @param props - The rows, what each one draws, and what stands above and below them.
 * @returns The list, holding its label, its field, its rows and what it says when it has none.
 */
export function Simple<Row>(props: SimpleProps<Row>): ReactElement {
  const {
    "aria-label": _named,
    collection,
    description: _description,
    empty,
    groupBy: _groupBy,
    groupLabel: _groupLabel,
    icon: _icon,
    label,
    narrowing,
    selectAll,
    summary,
    tall,
    ...root
  } = props;

  return (
    <Root {...root} collection={collection}>
      {label === undefined ? null : <Label>{label}</Label>}
      <Content {...boxed(props)}>
        {narrowing === undefined ? null : <Input {...narrowed(narrowing)} />}
        {selectAll === undefined ? null : <SelectAll>{selectAll}</SelectAll>}
        {tall === undefined ? (
          listed(props, collection.items)
        ) : (
          <Window count={collection.size}>
            {({ first, last }) => listed(props, collection.items.slice(first, last))}
          </Window>
        )}
        {empty === undefined ? null : <Empty>{empty}</Empty>}
      </Content>
      {summary === undefined ? null : <ValueText placeholder={summary} />}
    </Root>
  );
}
