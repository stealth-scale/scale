/**
 * Renders the search of the sidebar or of a block: a field that filters the rows of its scope, or
 * the container of a caller's own field.
 *
 * @remarks
 *   The search takes the forms package's search input props and renders the input, named by
 *   `aria-label`, `Search` when absent. It filters the rows of the scope it is in: every block's
 *   rows from the header, one block's rows from inside that block. A row whose words do not contain
 *   the query is hidden, and a branch that contains a match opens. The down arrow moves focus from
 *   the field to the first row its scope shows. On a rail in an app shell panel the search renders
 *   a button with the `searchIndicator`, which opens the panel and moves focus to the field.
 *   `shortcut` moves focus to the field with the platform's modifier from anywhere in the document,
 *   opening the panel first while it is closed, and the field announces it through
 *   `aria-keyshortcuts`. With children, the search contains the caller's field and the caller
 *   filters the rows. A rail removes a search it cannot open.
 */

import { type KeyboardEvent, type ReactElement, use, useRef } from "react";

import { SearchInput, type SearchInputProps } from "@stealthscale/component-forms";
import { FilterContext, useControllableState } from "@stealthscale/hooks";

import { withContext } from "#sidebar/context.ts";
import { useFocusing } from "#sidebar/focusing.ts";
import { Opener } from "#sidebar/opener.tsx";
import { keysOf, useShortcut } from "#sidebar/shortcut.ts";
import { fieldSizeOf, useSidebar } from "#sidebar/state.ts";

/**
 * Accessible name of the field and of the rail's button when the caller passes no `aria-label`.
 */
const NAME = "Search";

/**
 * Selects the rows a search's down arrow moves to: a link or a control in a list item of a block.
 */
const ROWS = ".sidebar__nav li :is(a[href], button)";

/**
 * Selects the scope a search's rows are read from: the block around the search, or the sidebar.
 */
const SCOPES = ".sidebar__nav, .sidebar__root";

/**
 * Renders the search `div` at the sidebar's size.
 */
const Found = withContext("div", "search");

/**
 * Describes the props of `Search`: the props of the forms package's search input and the shortcut.
 */
export interface SearchProps extends SearchInputProps {
  /**
   * Key that moves focus to the field with the platform's modifier held: `k` for ⌘K and Ctrl+K.
   */
  readonly shortcut?: string | undefined;
}

/**
 * Returns the first row the search's scope shows: in its block, or in the whole sidebar from the
 * header.
 *
 * @param field - The search's field.
 * @returns The row's link or control, or `null` while the scope shows no row.
 */
function firstRow(field: HTMLElement): HTMLElement | null {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the root contains every search
  const scope = field.closest(SCOPES) as Element;
  const rows = [...scope.querySelectorAll<HTMLElement>(ROWS)];

  return rows.find((row) => row.closest("[hidden]") === null) ?? null;
}

/**
 * Handles a key in the field after the caller's handler: the down arrow moves focus to the first
 * row the scope shows.
 *
 * @param event - The key press in the field.
 * @param onKeyDown - The caller's handler, which runs first and may prevent the move.
 */
function arrowed(
  event: KeyboardEvent<HTMLInputElement>,
  onKeyDown: SearchProps["onKeyDown"],
): void {
  onKeyDown?.(event);

  const row = event.key === "ArrowDown" ? firstRow(event.currentTarget) : null;

  if (event.defaultPrevented || row === null) return;

  row.focus();
  event.preventDefault();
}

/**
 * Describes what decides the search's form: the sidebar's rail, the panel it can open, the
 * caller's field and the mark.
 */
interface Formed {
  /**
   * The caller's own field, if any.
   */
  readonly children: SearchProps["children"];

  /**
   * Whether the sidebar is in a panel the search can open.
   */
  readonly expandable: boolean;

  /**
   * Whether the sidebar is a rail.
   */
  readonly iconic: boolean;

  /**
   * The mark of the field and of the rail's button.
   */
  readonly searchIndicator: SearchProps["searchIndicator"];
}

/**
 * Returns what the search renders: nothing on a rail it cannot open, the caller's field, the rail's
 * button, or the field.
 */
function formOf({ children, expandable, iconic, searchIndicator }: Formed): Form {
  if (iconic && (children !== undefined || searchIndicator === undefined || !expandable)) {
    return "none";
  }
  if (children !== undefined) return "children";

  return iconic ? "button" : "field";
}

/**
 * Selects what the search renders.
 */
type Form = "button" | "children" | "field" | "none";

/**
 * Renders the field that filters the scope, the rail's button, or the caller's field.
 *
 * @param props - The props of the search input and the shortcut.
 * @returns The `div` element, or nothing on a rail it cannot open.
 */
export function Search({
  "aria-label": named = NAME,
  children,
  defaultValue = "",
  onKeyDown,
  onValueChange,
  searchIndicator,
  shortcut,
  value: driven,
  ...rest
}: SearchProps): null | ReactElement {
  const { expand, expandable, iconic, open, size } = useSidebar();
  const scope = use(FilterContext);
  const [value, setValue] = useControllableState({
    defaultValue,
    onChange: onValueChange,
    value: driven,
  });
  const field = useRef<HTMLDivElement>(null);
  const focus = useFocusing(field, !iconic && open, expand);

  const form = formOf({ children, expandable, iconic, searchIndicator });

  useShortcut(children === undefined ? shortcut : undefined, focus);

  if (form === "none") return null;
  if (form === "children") return <Found>{children}</Found>;
  if (form === "button") {
    return (
      <Found>
        <Opener icon={searchIndicator} label={named} onOpen={focus} size={fieldSizeOf(size)} />
      </Found>
    );
  }

  return (
    <Found ref={field}>
      <SearchInput
        aria-keyshortcuts={keysOf(shortcut)}
        aria-label={named}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          arrowed(event, onKeyDown);
        }}
        onValueChange={(next) => {
          setValue(next);
          scope?.setQuery(next);
        }}
        searchIndicator={searchIndicator}
        size={fieldSizeOf(size)}
        value={value}
        {...rest}
      />
    </Found>
  );
}
