/**
 * Draws the list beneath a branch's row.
 *
 * @remarks
 *   The element is `ul`, and the machine names it with the identifier the trigger points at. The
 *   machine measures it and writes its height as a custom property, which is what the motion runs
 *   to, and hides it from a screen reader and from the tab order once it has closed, so a
 *   destination inside a closed branch is not something a keyboard reaches.
 *   The rows inside it are the same `Item` and `Link` the list above uses. The content mutes the
 *   ink and they inherit it, so a nested row is quieter without a part of its own.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#nav-list/context.ts";
import { useBranch } from "#nav-list/state.ts";

/**
 * Draws the nested list at the size the list above states.
 */
const Shown = withContext("ul", "content");

/**
 * Describes what the content takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Shown>, "hidden" | "id">;

/**
 * Appears and goes as the trigger above it is pressed.
 *
 * @param props - Everything a styled list takes, less what the machine states.
 * @returns The nested list, measured and named by the machine.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useBranch();

  return <Shown {...mergeProps(api.getContentProps(), props)} />;
}
