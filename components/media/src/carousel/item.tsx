/**
 * Renders one slide of the carousel.
 *
 * @remarks
 *   The machine makes a slide a `group` with the role description "slide", named "N of M" unless
 *   the caller passes `aria-label` or `aria-labelledby`. A slide out of the scroller's view is
 *   `inert`, so its links and buttons leave the tab order and the accessibility tree. The machine's
 *   own `aria-hidden` leaves them focusable.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type ItemProps as SlideProps } from "@zag-js/carousel";
import { mergeProps } from "@zag-js/react";

import { withContext } from "#carousel/context.ts";
import { useCarousel } from "#carousel/machine.ts";

/**
 * Renders the `div` with the carousel's slide class.
 */
const Drawn = withContext("div", "item");

/**
 * Describes the props of a slide: its index, where it snaps, and the props of a `div`.
 */
export interface ItemProps extends ComponentProps<typeof Drawn> {
  /**
   * Position of the slide among the slides, from zero.
   */
  readonly index: number;

  /**
   * Edge of the slide the scroller snaps to, `start` unless the caller passes another.
   */
  readonly snapAlign?: SlideProps["snapAlign"];
}

/**
 * Renders the slide with the machine's props merged under the caller's.
 *
 * @param props - The index, the snap edge and the props of a `div`.
 * @returns The `div` element.
 */
export function Item({ index, snapAlign, ...props }: ItemProps): ReactElement {
  const { api } = useCarousel();

  return (
    <Drawn
      {...mergeProps(api.getItemProps({ index, snapAlign }), props)}
      inert={!api.isInView(index) || undefined}
    />
  );
}
