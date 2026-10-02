/**
 * Renders the band between the header and the footer, with the dialog's main content.
 *
 * @remarks
 *   The band is the primitives package's scroll area, so its bar is the theme's. The scroll area's
 *   root grows to fill the panel, so a `cover` or `full` panel keeps its footer at the bottom, and
 *   the body inside it pads what scrolls. The body scrolls whenever the panel limits its height, as
 *   under `scrollBehavior="inside"`, while the header and the footer remain in view. While its
 *   content overflows, the viewport is a region in the tab order, named by the dialog's title, and
 *   the arrow keys scroll it. The props and `as` apply to the body inside the scroll area.
 */

import { type ComponentProps, type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#dialog/context.ts";
import { useDialog } from "#dialog/machine.ts";

/**
 * Renders the scroll area's root with the dialog's scroller class.
 */
const Scroller = withContext("div", "scroller");

/**
 * Renders the `div` with the dialog's body class.
 */
const Drawn = withContext("div", "body");

/**
 * Describes the props of the body: the props of a `div`.
 */
export type BodyProps = ComponentProps<typeof Drawn>;

/**
 * Renders the body inside a scroll area with a vertical bar.
 *
 * @param props - The props of a `div`.
 * @returns The scroll area's root.
 */
export function Body(props: BodyProps): ReactElement {
  const title: unknown = useDialog().getContentProps()["aria-labelledby"];

  return (
    <ScrollArea.Root as={Scroller}>
      <ScrollArea.Viewport aria-labelledby={typeof title === "string" ? title : undefined}>
        <ScrollArea.Content>
          <Drawn {...props} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}
