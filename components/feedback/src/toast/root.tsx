/**
 * Renders one toast.
 *
 * @remarks
 *   The machine gives the element `role="status"` and `aria-atomic`, points `aria-labelledby` and
 *   `aria-describedby` at the title and the description, and puts it in the tab order, where
 *   Escape dismisses it. It writes the toast's type as `data-type` and its motion as custom
 *   properties the recipe reads. The two empty elements the machine asks for keep the pointer over
 *   the stack while a toast leaves and between two toasts.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toast/context.ts";
import { useToast } from "#toast/machine.ts";

/**
 * Renders the `div` with the toast's root class.
 */
const Drawn = withContext("div", "root");

/**
 * Describes the props of the root: the props of a `div`.
 */
export type RootProps = ComponentProps<typeof Drawn>;

/**
 * Renders the toast with the machine's root props merged over the caller's, between the machine's
 * two empty elements.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Root({ children, ...props }: RootProps): ReactElement {
  const api = useToast();

  return (
    <Drawn {...mergeProps(api.getRootProps(), props)}>
      <div {...api.getGhostBeforeProps()} />
      {children}
      <div {...api.getGhostAfterProps()} />
    </Drawn>
  );
}
