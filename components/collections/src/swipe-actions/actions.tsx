/**
 * Renders a swipe row's actions: the buttons at the row's inline end that a swipe reveals.
 *
 * @remarks
 *   The actions follow the content in the document, so Tab reaches a row's own links first and its
 *   actions after them. Focus entering the actions opens them, and focus leaving them closes them,
 *   so a keyboard reaches every action with no gesture. Escape closes them and moves focus to the
 *   row. The row reveals the actions' own width, so the actions take their buttons' width.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#swipe-actions/context.ts";
import { useSwipe } from "#swipe-actions/state.ts";

/**
 * Renders the actions `div` with the recipe's actions class.
 */
const Panel = withContext("div", "actions");

/**
 * Describes the props of the actions: the props of a `div` without `ref`, which the row keeps.
 */
export type ActionsProps = Omit<ComponentProps<typeof Panel>, "ref">;

/**
 * Describes the handlers the actions put on their element.
 */
type Handlers = Pick<ComponentProps<"div">, "onBlur" | "onFocus" | "onKeyDown">;

/**
 * Renders the actions with the focus and key handlers merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Actions(props: ActionsProps): ReactElement {
  const { dismiss, setActions, settle } = useSwipe();
  const own: Handlers = {
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) settle(false);
    },
    onFocus: () => {
      settle(true);
    },
    onKeyDown: (event) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      dismiss();
    },
  };

  return <Panel ref={setActions} {...mergeProps(own, props)} />;
}
