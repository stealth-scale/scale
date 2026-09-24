/**
 * Renders the popover's panel.
 *
 * @remarks
 *   The machine sets `role="dialog"`, and `aria-labelledby` and `aria-describedby` when a title and
 *   a description are rendered. It moves focus into the panel on opening, unless `autoFocus` is
 *   false, and back to the trigger on closing.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Renders the `div` with the popover's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`.
 */
export type ContentProps = ComponentProps<typeof Drawn>;

/**
 * Renders the panel with the machine's content props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getContentProps(), props)} />;
}
