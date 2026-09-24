/**
 * Renders the row of the panels and the main region between the bars, and the backdrop.
 *
 * @remarks
 *   The children render in source order, so the caller decides which panel leads. A panel that has
 *   dropped under the page wraps onto its own row. The body renders one backdrop behind every panel
 *   over the page, and a press on it closes each of them. The backdrop is always in the document
 *   and fades in and out, so the transition runs in both directions. It has `aria-hidden` and takes
 *   no pointer events while no panel is over the page.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Renders the body `div`.
 */
const Across = withContext("div", "body");

/**
 * Renders the backdrop `div` behind a panel over the page.
 */
const Backdrop = withContext("div", "backdrop");

/**
 * Describes the props of `Body`.
 */
export type BodyProps = ComponentProps<typeof Across>;

/**
 * Renders the row between the bars and the backdrop.
 *
 * @param props - The panels, the main region and the `div` element's props.
 * @returns The row, ending with the backdrop.
 */
export function Body({ children, ...rest }: BodyProps): ReactElement {
  const sheets = useOverlaid();

  return (
    <Across {...rest}>
      {children}
      <Backdrop
        aria-hidden
        data-state={sheets.length > 0 ? "open" : "closed"}
        onClick={() => {
          for (const sheet of sheets) sheet.setOpen(false);
        }}
      />
    </Across>
  );
}
