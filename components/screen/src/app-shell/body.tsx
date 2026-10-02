/**
 * Renders the row of the panels and the main region between the bars, and the backdrop.
 *
 * @remarks
 *   The body is the primitives package's scroll area. Its content is the row, which is as tall as
 *   the viewport while the main region scrolls. While a panel has dropped under the page, the row
 *   wraps it onto a row of its own and grows, and the body scrolls the main region and the panel
 *   together. The children render in source order, so the caller decides which panel leads. The
 *   body renders one backdrop behind every panel over the page, and a press on it closes each of
 *   them. The backdrop is always in the document and fades in and out, so the transition runs in
 *   both directions. It has `aria-hidden` and takes no pointer events while no panel is over the
 *   page.
 */

import { type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Renders the body `div`, the scroll area's root.
 */
const Across = withContext("div", "body");

/**
 * Renders the body's viewport `div`, which scrolls only while a panel is under the page.
 */
const Viewed = withContext("div", "bodyViewport");

/**
 * Renders the row `div` of the panels and the main region, the scroll area's content.
 */
const Row = withContext("div", "row");

/**
 * Renders the backdrop `div` behind a panel over the page.
 */
const Backdrop = withContext("div", "backdrop");

/**
 * Describes the props of `Body`: the props of the row, without `as`, because the row is the scroll
 * area's content and another element in its place would drop the content's part.
 */
export type BodyProps = Omit<ScrollArea.ContentProps, "as">;

/**
 * Renders the body as a scroll area around the row, which ends with the backdrop.
 *
 * @param props - The panels, the main region and the row's props.
 * @returns The scroll area's root around the row.
 */
export function Body({ children, ...rest }: BodyProps): ReactElement {
  const sheets = useOverlaid();

  return (
    <ScrollArea.Root as={Across}>
      <ScrollArea.Viewport as={Viewed} focusable={false}>
        <ScrollArea.Content as={Row} {...rest}>
          {children}
          <Backdrop
            aria-hidden
            data-state={sheets.length > 0 ? "open" : "closed"}
            onClick={() => {
              for (const sheet of sheets) sheet.setOpen(false);
            }}
          />
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}
