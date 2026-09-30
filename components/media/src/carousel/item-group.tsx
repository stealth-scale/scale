/**
 * Renders the scroller that holds the slides and snaps a page at a time.
 *
 * @remarks
 *   The machine lays the slides out inline, and makes the scroller a polite live region while the
 *   carousel does not rotate, so a screen reader reads the slide a reader moved to. The scroller is
 *   in the tab order while no slide holds a control. While the scroller itself has focus, the arrow
 *   keys of its orientation, Home and End move a page, at once under reduced motion.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#carousel/context.ts";
import { paged } from "#carousel/keys.ts";
import { useCarousel } from "#carousel/machine.ts";

/**
 * Renders the `div` with the carousel's scroller class.
 */
const Drawn = withContext("div", "itemGroup");

/**
 * Describes the props of the scroller: the props of a `div`, the slides among its children.
 */
export type ItemGroupProps = ComponentProps<typeof Drawn>;

/**
 * Renders the scroller with the machine's props merged under the caller's.
 *
 * @param props - The props of a `div`, the slides among its children.
 * @returns The `div` element.
 */
export function ItemGroup(props: ItemGroupProps): ReactElement {
  const { api, instant, send } = useCarousel();
  const keys: Pick<ComponentProps<"div">, "onKeyDown"> = {
    /**
     * Moves a page on a key the scroller itself receives.
     */
    onKeyDown(event) {
      if (event.target !== event.currentTarget) return;

      const step = paged(event.key, event.currentTarget, api.pageSnapPoints.length - 1);

      if (step === undefined) return;

      event.preventDefault();
      send({ ...step, instant });
    },
  };

  return <Drawn {...mergeProps(api.getItemGroupProps(), keys, props)} />;
}
