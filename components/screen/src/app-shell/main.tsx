/**
 * Renders the main region of the shell.
 *
 * @remarks
 *   The region is the primitives package's scroll area, and its viewport is the `main` element,
 *   the `main` landmark, so the element that scrolls the page is `main`. Render one. A page inside
 *   it has no landmark of its own and grows to the region's height. The region is inert while a
 *   panel is over the page, so the page behind the backdrop takes no press and no focus, and the
 *   panel behaves as a sheet without a dialog role.
 */

import { type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Renders the region's box, the scroll area's root.
 */
const Framed = withContext("div", "main");

/**
 * Renders the `main` element, the scroll area's viewport.
 */
const Landmark = withContext("main", "mainViewport");

/**
 * Renders the column the page grows in, the scroll area's content.
 */
const Column = withContext("div", "column");

/**
 * Describes the props of `Main`: the props of the `main` element.
 */
export type MainProps = Omit<ScrollArea.ViewportProps, "as" | "focusable">;

/**
 * Renders the main region in the space the panels leave, scrolling when the page scrolls.
 *
 * @param props - The `main` element's props, the page among its children.
 * @returns The main region, inert while a panel is over the page.
 */
export function Main({ children, ...props }: MainProps): ReactElement {
  const sheets = useOverlaid();

  return (
    <ScrollArea.Root as={Framed} inert={sheets.length > 0}>
      {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- the viewport renders `main` through `as`, and the role keeps the region role off it */}
      <ScrollArea.Viewport as={Landmark} role="main" {...props}>
        <ScrollArea.Content as={Column}>{children}</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}
