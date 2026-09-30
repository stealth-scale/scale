/**
 * Renders the marquee's items once, and again in each copy that fills the loop.
 *
 * @remarks
 *   The machine asks for one copy after the first, or as many as fill the viewport under
 *   `autoFill`. Every copy after the first is `aria-hidden` and `inert`, so a screen reader reads
 *   the items once and Tab reaches each link or button once. The machine marks a copy `aria-hidden`
 *   alone, which left the controls in a copy in the tab order.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#marquee/context.ts";
import { useMarquee } from "#marquee/machine.ts";

/**
 * Renders the `div` with the marquee's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`, which every copy receives.
 */
export type ContentProps = ComponentProps<typeof Drawn>;

/**
 * Renders the first copy and the copies the machine asks for.
 *
 * @param props - The items and the props of a `div`.
 * @returns The copies.
 */
export function Content(props: ContentProps): ReactElement {
  const { api } = useMarquee();
  const copies = Array.from({ length: api.contentCount }, (_, index) => index);

  return (
    <>
      {copies.map((index) => (
        <Drawn
          key={index}
          {...mergeProps(api.getContentProps({ index }), index === 0 ? {} : { inert: true }, props)}
        />
      ))}
    </>
  );
}
