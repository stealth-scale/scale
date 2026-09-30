/**
 * Renders the band under the header, with the panel's main content.
 *
 * @remarks
 *   The band is the primitives package's scroll area, so its bar is the theme's. The scroll area's
 *   root fills the panel under the header, ends clear of the end and bottom resize triggers, and is
 *   hidden while the panel is minimized. While its content overflows, the viewport is a region in
 *   the tab order, named by the panel's title, and the arrow keys scroll it. The props and `as`
 *   apply to the body inside the scroll area.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#floating-panel/context.ts";
import { useFloatingPanel } from "#floating-panel/machine.ts";

/**
 * Renders the scroll area's root with the floating panel's scroller class.
 */
const Scroller = withContext("div", "scroller");

/**
 * Renders the `div` with the floating panel's body class.
 */
const Drawn = withContext("div", "body");

/**
 * Describes the props of the body: the props of a `div`.
 */
export type BodyProps = ComponentProps<typeof Drawn>;

/**
 * Renders the body inside a scroll area with a vertical bar, hidden while the panel is minimized.
 *
 * @param props - The props of a `div`.
 * @returns The scroll area's root.
 */
export function Body(props: BodyProps): ReactElement {
  const { api } = useFloatingPanel();
  const machine = api.getBodyProps();
  const title: unknown = api.getTitleProps()["id"];

  return (
    <ScrollArea.Root as={Scroller} hidden={machine["hidden"] === true}>
      <ScrollArea.Viewport aria-labelledby={String(title)}>
        <ScrollArea.Content>
          <Drawn {...mergeProps(machine, props)} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}
