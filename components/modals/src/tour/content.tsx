/**
 * Renders a step's card.
 *
 * @remarks
 *   The card is a `dialog` named by the title and described by the description. It is modal on a
 *   dialog step only, so on a tooltip step a screen reader reads the target and the page around the
 *   card. The card is a polite live region, so the next step is read out while focus remains on
 *   the button that moved to it. Focus moves to the card's first control when the tour starts, and
 *   Tab keeps it among the card's controls and the controls inside the target. ArrowRight and
 *   ArrowLeft move to the next and the previous step while `keyboardNavigation` is true, and Escape
 *   ends the tour while `closeOnEscape` is true. The card is shown and inert while its exit
 *   animation runs.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { usePanelPresence, useTourContext } from "#tour/machine.ts";

/**
 * Renders the `div` with the tour's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Renders the card with the machine's content props, its role and the presence props merged over
 * the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useTourContext();
  const { props: presented, setNode } = usePanelPresence();
  const {
    "aria-modal": _modal,
    role: _role,
    ...machine
  }: ContentProps = { ...api.getContentProps() };
  const modal = api.step?.type === "dialog" ? { "aria-modal": true } : {};

  return (
    <Drawn
      {...mergeProps({ ...machine, ...modal, role: "dialog", ...presented }, props)}
      ref={setNode}
    />
  );
}
