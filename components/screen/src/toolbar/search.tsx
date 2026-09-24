/**
 * Renders the search, which covers a narrow row while it is open.
 *
 * @remarks
 *   A search field and a row of controls do not fit on a phone. An opened search covers the row
 *   and fills it, and a closed search renders in its band. The caller sets `opened`, because the
 *   control that opens the search is the caller's too. Opening moves focus to the field, and
 *   closing moves focus back to the control that opened it, which the open search covers.
 */

import { type ComponentProps, type ReactElement, useRef } from "react";

import { useFocused } from "#focus/index.ts";
import { withContext } from "#toolbar/context.ts";

/**
 * Selects the element that takes focus when the search opens.
 */
const FIELD = "input, textarea, [contenteditable=true]";

/**
 * Renders the `div` with the recipe's search class.
 */
const Sought = withContext("div", "search");

/**
 * Describes the props of the search: `opened` and the props of a `div`.
 */
export interface SearchProps extends ComponentProps<typeof Sought> {
  /**
   * Whether the search covers the row.
   */
  readonly opened?: boolean | undefined;
}

/**
 * Renders the search, with `data-opened` while it covers the row.
 *
 * @param props - Whether it is open, and the props of a `div`.
 * @returns The `div` element.
 */
export function Search({ opened, ...rest }: SearchProps): ReactElement {
  const sought = useRef<HTMLDivElement>(null);

  useFocused(sought, opened === true, FIELD);

  return <Sought {...rest} data-opened={opened === true ? "" : undefined} ref={sought} />;
}
