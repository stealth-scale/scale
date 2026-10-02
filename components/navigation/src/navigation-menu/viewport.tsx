/**
 * Renders the panel surface every item's content shows in, which moves and resizes between them.
 *
 * @remarks
 *   The element is in the document from the first render, because the machine looks for it once,
 *   as it starts, to decide whether panels show inside it. It is `hidden` while every item is
 *   closed and fades out before it hides. It reads its size and place from the root's
 *   `--viewport-width`, `--viewport-height` and `--viewport-x`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined, usePresence } from "@stealthscale/hooks";

import { withContext } from "#navigation-menu/context.ts";
import { useNavigationMenu } from "#navigation-menu/machine.ts";
import { useAlign } from "#navigation-menu/scopes.ts";

/**
 * Renders the `div` with the navigation menu's viewport class.
 */
const Shown = withContext("div", "viewport");

/**
 * Describes the props of the viewport: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ViewportProps = Omit<ComponentProps<typeof Shown>, "ref">;

/**
 * Renders the viewport with the machine's viewport props and the presence props merged over the
 * caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Viewport(props: ViewportProps): ReactElement {
  const api = useNavigationMenu();
  const { props: presented, setNode } = usePresence({ present: api.open });

  return (
    <Shown
      {...mergeProps(api.getViewportProps(omitUndefined({ align: useAlign() })), presented, props)}
      ref={setNode}
    />
  );
}
