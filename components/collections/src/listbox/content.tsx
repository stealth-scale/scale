/**
 * Renders the list of rows.
 *
 * @remarks
 *   The element is a `div` with `role="listbox"` and the tab stop. Focus stays on it, and the
 *   machine points its `aria-activedescendant` at the highlighted row, so a row never takes focus.
 *   The content scrolls, so the label and the field stay in place while the rows move. The role
 *   replaces the element's own semantics, so a `ul` would add nothing.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Renders the `div` with the listbox's content class.
 */
const Listed = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`.
 */
export type ContentProps = ComponentProps<typeof Listed>;

/**
 * Renders the list with the machine's content props.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element with `role="listbox"`.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useListbox();

  return <Listed {...mergeProps(api.getContentProps(), props)} />;
}
