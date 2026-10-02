/**
 * Renders the hover card's panel.
 *
 * @remarks
 *   The machine gives the panel no role and `tabIndex={-1}`, and moves no focus into it, so the
 *   panel is outside the tab order and a screen reader does not learn that it opened. A pointer
 *   that rests on the panel keeps the card open. The panel is shown while its exit animation runs.
 *   The positioner around it renders nothing while the panel is out of the document.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#hover-card/context.ts";
import { useCardPresence, useHoverCard } from "#hover-card/machine.ts";

/**
 * Renders the `div` with the hover card's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Renders the panel with the machine's content props and the presence props merged over the
 * caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useHoverCard();
  const { props: presented, setNode } = useCardPresence();

  return <Drawn {...mergeProps(api.getContentProps(), presented, props)} ref={setNode} />;
}
