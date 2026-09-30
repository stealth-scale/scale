/**
 * Renders the forms package's search input in the row, and on a narrow row the button it folds to.
 *
 * @remarks
 *   The search takes the search input's props and no props of its own. On a narrow row it renders
 *   a button with the input's `searchIndicator` as its mark and the input's `aria-label` as its
 *   name, `Search` when absent. The button opens the field over the whole row, the row's padding
 *   and edge included. Escape on the empty field or focus leaving the empty field closes it, and
 *   the field's own Escape empties a filled field first. Opening moves focus to the field, and
 *   closing returns it to the button, because a browser that does not focus a pressed button leaves
 *   no control to return to. The field is a tab stop of its own and not a roving item, so the arrow
 *   keys move its caret.
 */

import { type FocusEvent, type KeyboardEvent, type ReactElement, useRef, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { SearchInput, type SearchInputProps } from "@stealthscale/component-forms";

import { useFocused } from "#focus/index.ts";
import { withContext } from "#toolbar/context.ts";
import { Item } from "#toolbar/item.tsx";
import { useToolbar } from "#toolbar/state.ts";

/**
 * Selects the element that takes focus when the search opens.
 */
const FIELD = "input";

/**
 * Accessible name of the field and of the folded button when the caller passes no `aria-label`.
 */
const NAME = "Search";

/**
 * Renders the `div` with the recipe's search class.
 */
const Sought = withContext("div", "search");

/**
 * Describes the props of the search: the props of the forms package's search input.
 */
export type SearchProps = SearchInputProps;

/**
 * Returns whether the reader left the search with its field empty.
 */
function leftEmpty(event: FocusEvent<HTMLDivElement>): boolean {
  const next = event.relatedTarget;

  if (next instanceof Node && event.currentTarget.contains(next)) return false;

  return event.currentTarget.querySelector("input")?.value === "";
}

/**
 * Renders the field, and on a narrow row the button it folds to.
 *
 * @param props - The props of the search input.
 * @returns The field, the folded button, or both while the search is open.
 */
export function Search({
  "aria-label": named = NAME,
  searchIndicator,
  size,
  ...rest
}: SearchProps): ReactElement {
  const { narrow, size: row } = useToolbar();
  const [open, setOpen] = useState(false);
  const sought = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const opened = narrow && open;

  useFocused(sought, opened, FIELD, narrow ? opener : undefined);

  const search = (
    <Sought
      data-opened={opened ? "" : undefined}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        if (narrow && leftEmpty(event)) setOpen(false);
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (narrow && event.key === "Escape") setOpen(false);
      }}
      ref={sought}
    >
      <SearchInput
        aria-label={named}
        searchIndicator={searchIndicator}
        size={size ?? row}
        {...rest}
      />
    </Sought>
  );

  if (!narrow) return search;

  const content =
    searchIndicator === undefined
      ? { children: named }
      : ({ "aria-label": named, children: searchIndicator, shape: "square" } as const);

  return (
    <>
      <Item
        aria-expanded={opened}
        as={Button}
        onClick={() => {
          setOpen(true);
        }}
        ref={opener}
        size={row}
        variant="ghost"
        {...content}
      />
      {opened && search}
    </>
  );
}
