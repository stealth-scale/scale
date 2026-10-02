/**
 * Renders the nested list of a branch.
 *
 * @remarks
 *   The element is `ul`. The machine sets its id, which the trigger's `aria-controls` references,
 *   and writes its measured height to a custom property for the collapse animation. Once the list
 *   is closed, the machine sets `hidden`, which removes the nested links from the tab order and the
 *   accessibility tree. Nested rows use the same `Item` and `Link` parts as the top level. The
 *   content sets `fg.muted`, and the nested rows inherit it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#nav-list/context.ts";
import { useBranch } from "#nav-list/machine.ts";

/**
 * Renders the nested `ul` with the list's variants.
 */
const Shown = withContext("ul", "content");

/**
 * Describes the props of `Content`, less the `hidden` and `id` attributes the machine sets.
 */
export type ContentProps = Omit<ComponentProps<typeof Shown>, "hidden" | "id">;

/**
 * Renders the nested list with the machine's content props merged under the caller's.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useBranch();

  return <Shown {...mergeProps(api.getContentProps(), props)} />;
}
