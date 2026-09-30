/**
 * Renders a whole listbox from props: a label, a filter field or a select-all row, the rows, the
 * empty text and a summary.
 *
 * @remarks
 *   A list with another structure composes the parts. Filtering stays the caller's: the field
 *   reports the text and the caller passes a filtered collection. An `aria-label` goes on the
 *   element with `role="listbox"`, and only when the list has no visible label.
 */

import { type ReactElement, type ReactNode } from "react";

import { type ListCollection } from "@zag-js/collection";

import {
  Content,
  type ContentProps,
  Empty,
  Frame,
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
 * Describes the filter field above the rows.
 */
export interface Narrowing {
  /**
   * Icon of the clear control. The control renders only when an icon is given.
   */
  readonly clearIndicator?: ReactNode | undefined;

  /**
   * Accessible name of the clear control.
   */
  readonly clearLabel?: string | undefined;

  /**
   * Called with the field's text on every change. The caller passes back a filtered collection.
   */
  readonly onNarrow: (typed: string) => void;

  /**
   * Placeholder of the field.
   */
  readonly placeholder?: string | undefined;
}

/**
 * Describes the props of a whole listbox: the root's props and the parts it renders.
 *
 * @typeParam Row - Type of one collection item.
 */
export interface SimpleProps<Row> extends Omit<RootProps, "children" | "collection"> {
  /**
   * Rows in render order.
   */
  readonly collection: ListCollection<Row>;

  /**
   * Returns the description rendered under a row's text.
   */
  readonly description?: ((row: Row) => ReactNode) | undefined;

  /**
   * Text rendered while the collection is empty.
   */
  readonly empty?: ReactNode | undefined;

  /**
   * Returns the key of the group a row belongs to.
   */
  readonly groupBy?: ((row: Row) => string) | undefined;

  /**
   * Returns the label of a group from its key. Defaults to the key.
   */
  readonly groupLabel?: ((under: string) => ReactNode) | undefined;

  /**
   * Returns the icon rendered before a row's text.
   */
  readonly icon?: ((row: Row) => ReactNode) | undefined;

  /**
   * Label rendered above the list.
   */
  readonly label?: ReactNode | undefined;

  /**
   * Filter field rendered above the rows.
   */
  readonly narrowing?: Narrowing | undefined;

  /**
   * Text of the select-all row rendered above the rows.
   */
  readonly selectAll?: ReactNode | undefined;

  /**
   * Placeholder of the summary rendered under the list, which shows the selected rows' text.
   */
  readonly summary?: string | undefined;

  /**
   * Height of the list in rows. A list with a height renders only the rows in or near its
   * viewport.
   */
  readonly tall?: number | undefined;
}

/**
 * Describes the props one row reads.
 *
 * @typeParam Row - Type of one collection item.
 */
type Drawing<Row> = Pick<SimpleProps<Row>, "collection" | "description" | "icon">;

/**
 * Returns one ready-made row.
 *
 * @typeParam Row - Type of one collection item.
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
 * Returns the rows grouped by key, in the order each key first appears.
 *
 * @typeParam Row - Type of one collection item.
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
 * Returns the rows, in groups when the list states `groupBy`.
 *
 * @typeParam Row - Type of one collection item.
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
 * Returns the field's props from the filter settings, with `onNarrow` passed as `onValueChange`.
 */
function narrowed({ onNarrow, ...rest }: Narrowing): InputProps {
  return { ...rest, onValueChange: onNarrow };
}

/**
 * Returns the content's props: `aria-label` when the list has no label, and a height in rows when
 * the list states one.
 *
 * @typeParam Row - Type of one collection item.
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
 * Renders a whole listbox from props.
 *
 * @remarks
 *   The field, the select-all row and the empty text render in the frame, outside the element with
 *   `role="listbox"`, which allows only options and groups. The rows scroll inside that element, so
 *   the field and the select-all row stay in place. The label and the summary render outside the
 *   frame.
 * @typeParam Row - Type of one collection item.
 * @param props - The collection, the row renderers and the parts above and below the rows.
 * @returns The listbox.
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
      <Frame>
        {narrowing === undefined ? null : <Input {...narrowed(narrowing)} />}
        {selectAll === undefined ? null : <SelectAll>{selectAll}</SelectAll>}
        <Content {...boxed(props)}>
          {tall === undefined ? (
            listed(props, collection.items)
          ) : (
            <Window count={collection.size}>
              {({ first, last }) => listed(props, collection.items.slice(first, last))}
            </Window>
          )}
        </Content>
        {empty === undefined ? null : <Empty>{empty}</Empty>}
      </Frame>
      {summary === undefined ? null : <ValueText placeholder={summary} />}
    </Root>
  );
}
