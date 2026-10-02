/**
 * Renders one dot, the button that moves the carousel to a page.
 *
 * @remarks
 *   The dot is named "Go to slide N" unless the caller passes `label`. The dot of the current page
 *   sets `aria-disabled`, as the APG carousel pattern marks the picker of the slide in view. A
 *   press on a dot moves to its page, at once under reduced motion, unless the dot is `readOnly`.
 */

import { type ComponentProps, type MouseEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#carousel/context.ts";
import { useCarousel } from "#carousel/machine.ts";

/**
 * Renders the `button` with the carousel's dot class.
 */
const Drawn = withContext("button", "indicator");

/**
 * Describes the props of a dot: its page, its name, whether it only shows the page, and the props
 * of a `button`.
 */
export interface IndicatorProps extends ComponentProps<typeof Drawn> {
  /**
   * Index of the page the dot moves to, from zero.
   */
  readonly index: number;

  /**
   * Accessible name of the dot, "Go to slide N" unless the caller passes another.
   */
  readonly label?: string | undefined;

  /**
   * Whether the dot only shows its page and a press does nothing.
   */
  readonly readOnly?: boolean | undefined;
}

/**
 * Renders the dot with the machine's props merged under the caller's.
 *
 * @param props - The page, the name, the read-only flag and the props of a `button`.
 * @returns The `button` element.
 */
export function Indicator({ index, label, readOnly, ...rest }: IndicatorProps): ReactElement {
  const { api, instant, send } = useCarousel();
  const picked = {
    "aria-disabled": index === api.page || undefined,

    /**
     * Moves to the dot's page unless the caller cancelled the press or the dot is read-only, and
     * stops the machine's own press handler.
     */
    onClick(event: MouseEvent<HTMLButtonElement>): void {
      if (event.defaultPrevented) return;

      event.preventDefault();

      if (readOnly !== true) send({ index, instant, src: "indicator", type: "PAGE.SET" });
    },
  };

  return (
    <Drawn
      {...mergeProps(api.getIndicatorProps({ index, readOnly }), picked, rest)}
      {...omitUndefined({ "aria-label": label })}
    />
  );
}
