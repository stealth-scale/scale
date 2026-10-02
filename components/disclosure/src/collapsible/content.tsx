/**
 * Renders the content the trigger shows and hides.
 *
 * @remarks
 *   The machine measures the content and sets its height as a custom property, which the animation
 *   reads. While the content is closed the machine sets `hidden`, so a control inside it leaves the
 *   tab order. The machine sets `data-state="open"` from the first animation frame, so content that
 *   starts open does not animate in. Happy-dom runs no animation frames, so the specs read the
 *   closed state and `hidden`, not the open state.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#collapsible/context.ts";
import { useCollapsible } from "#collapsible/machine.ts";

/**
 * Renders the `div` with the collapsible's content class.
 */
const Shown = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`.
 */
export type ContentProps = ComponentProps<typeof Shown>;

/**
 * Renders the content with the machine's content props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useCollapsible();

  return <Shown {...mergeProps(api.getContentProps(), props)} />;
}
