/**
 * Renders a band of a panel or of the main region.
 *
 * @remarks
 *   A section is a padded column. `grows` gives it the room its siblings leave, so a panel's list
 *   fills the height between a band above and a band below. `scrolls` renders it inside the
 *   primitives package's scroll area, so the bands around it remain in place: the band pads what
 *   scrolls, and the bar is at the band's edge. The props and `as` apply to the band in both cases.
 *   A band that scrolls is for content whose every item takes focus, such as a list of links or a
 *   navigation, so its viewport is outside the tab order. The props write `data-grows`, which the
 *   recipe reads.
 */

import { type ComponentProps, type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#app-shell/context.ts";

/**
 * Renders the section `div`.
 */
const Banded = withContext("div", "section");

/**
 * Renders the root `div` of a section that scrolls.
 */
const Scroller = withContext("div", "scroller");

/**
 * Describes the props of `Section`.
 */
export interface SectionProps extends ComponentProps<typeof Banded> {
  /**
   * Whether the section takes the room its siblings leave.
   */
  readonly grows?: boolean | undefined;

  /**
   * Whether the section scrolls its own content.
   */
  readonly scrolls?: boolean | undefined;
}

/**
 * Renders the band, inside a scroll area when it scrolls.
 *
 * @param props - `grows`, `scrolls` and the `div` element's props.
 * @returns The `div` element, or the scroll area's root around it.
 */
export function Section({ grows = false, scrolls = false, ...rest }: SectionProps): ReactElement {
  const grown = grows ? "" : undefined;

  if (!scrolls) return <Banded {...rest} data-grows={grown} />;

  return (
    <ScrollArea.Root as={Scroller} data-grows={grown}>
      <ScrollArea.Viewport focusable={false}>
        <ScrollArea.Content>
          <Banded {...rest} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}
