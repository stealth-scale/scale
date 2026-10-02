/**
 * Renders text clipped to a number of lines, with the whole text in a tooltip while it is clipped.
 *
 * @remarks
 *   The text is measured, so the tooltip opens only while something is cut off, and text that fits
 *   renders no tooltip and no tab stop. A clamp clips the paint and not the document, so a screen
 *   reader reads the whole text once, and the tooltip's content is hidden from it. The root is a
 *   `span`, which is valid inside a paragraph, and the tooltip renders in a portal outside the text
 *   that clips, under the start of the text. A scroll does not close the tooltip, which follows the
 *   text, because a Tab onto text below the fold scrolls the page as it opens the tooltip.
 */

import { type ReactElement, useRef } from "react";

import { Portal } from "@stealthscale/component-primitives";
import { useIsOverflowing } from "@stealthscale/hooks";

import { Content } from "#tooltip/content.tsx";
import { Positioner } from "#tooltip/positioner.tsx";
import { Root } from "#tooltip/root.tsx";
import { Clipped, type ClippedProps } from "#truncate/clipped.tsx";

/**
 * Placement of the tooltip: under the text, from its start.
 */
const START = { placement: "bottom-start" } as const;

/**
 * Describes the props of the truncated text: the text, its line count, whether it takes a tab stop
 * while clipped, and the props of a `span`.
 */
export interface TruncateProps extends Omit<
  ClippedProps,
  "children" | "clipped" | "focusable" | "lines" | "ref"
> {
  /**
   * Whole text, as a string.
   */
  readonly children: string;

  /**
   * Whether the text takes a tab stop while it is clipped, false unless stated.
   *
   * @remarks
   *   A keyboard opens the tooltip only from a tab stop. Text that fits takes none either way.
   */
  readonly focusable?: boolean | undefined;

  /**
   * Lines the text keeps, 1 unless stated.
   */
  readonly lines?: number | undefined;
}

/**
 * Renders the text, clipped, and the tooltip with the whole text.
 *
 * @param props - The text, its line count, the tab stop and the props of a `span`.
 * @returns The tooltip's root around the text.
 */
export function Truncate({
  children,
  focusable = false,
  lines = 1,
  ...props
}: TruncateProps): ReactElement {
  const held = useRef<HTMLSpanElement>(null);
  const { overflows } = useIsOverflowing(held);

  return (
    <Root as="span" closeOnScroll={false} disabled={!overflows} positioning={START}>
      <Clipped {...props} clipped={overflows} focusable={focusable} lines={lines} ref={held}>
        {children}
      </Clipped>
      <Portal>
        <Positioner>
          <Content aria-hidden>{children}</Content>
        </Positioner>
      </Portal>
    </Root>
  );
}
