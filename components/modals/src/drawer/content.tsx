/**
 * Renders the drawer's panel.
 *
 * @remarks
 *   The machine sets `role` (`dialog` or `alertdialog`), `aria-modal`, and `aria-labelledby` and
 *   `aria-describedby` while a title and a description are rendered, or the root's `aria-label` in
 *   place of the title. A modal drawer traps focus in the panel, stops the page from scrolling and
 *   hides the rest of the page from assistive technology while it is open. On opening, focus moves
 *   to the element marked `data-autofocus`, else to the first element that takes focus, else to the
 *   panel. On closing, focus returns to the trigger. The panel is shown and inert while its exit
 *   animation runs.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#drawer/context.ts";
import { useDrawer, usePanelPresence } from "#drawer/machine.ts";

/**
 * Renders the `div` with the drawer's content class.
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
  const api = useDrawer();
  const { props: presented, setNode } = usePanelPresence();

  return <Drawn {...mergeProps(api.getContentProps(), presented, props)} ref={setNode} />;
}
