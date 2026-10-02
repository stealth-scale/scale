/**
 * Renders the group that holds the carousel's dots, one per page.
 *
 * @remarks
 *   While a dot has focus, the arrow keys of the carousel's orientation, Home and End move a page,
 *   and focus moves to the new page's dot. The keys follow `dir`, and the page moves at once under
 *   reduced motion.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#carousel/context.ts";
import { paged } from "#carousel/keys.ts";
import { useCarousel } from "#carousel/machine.ts";

/**
 * Renders the `div` with the carousel's dot group class.
 */
const Drawn = withContext("div", "indicatorGroup");

/**
 * Describes the props of the dot group: the props of a `div`, the dots among its children.
 */
export type IndicatorGroupProps = ComponentProps<typeof Drawn>;

/**
 * Renders the dot group with the machine's props merged under the caller's.
 *
 * @param props - The props of a `div`, the dots among its children.
 * @returns The `div` element.
 */
export function IndicatorGroup(props: IndicatorGroupProps): ReactElement {
  const { api, instant, send } = useCarousel();
  const keys: Pick<ComponentProps<"div">, "onKeyDown"> = {
    /**
     * Moves a page unless the caller cancelled the key, and stops the machine's own key handler.
     */
    onKeyDown(event) {
      if (event.defaultPrevented) return;

      const step = paged(event.key, event.currentTarget, api.pageSnapPoints.length - 1);

      if (step === undefined) return;

      event.preventDefault();
      send({ ...step, instant, src: "indicator" });
    },
  };

  return <Drawn {...mergeProps(api.getIndicatorGroupProps(), keys, props)} />;
}
