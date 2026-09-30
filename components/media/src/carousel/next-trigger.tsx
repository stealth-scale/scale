/**
 * Renders the button that moves the carousel to the next page.
 *
 * @remarks
 *   The element is the library's square `Button`, named "Next slide" unless the caller passes
 *   another `label`. The caller passes the glyph as children. On the last page of a carousel that
 *   does not loop, the trigger sets `aria-disabled` and keeps focus.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { type ButtonProps } from "@stealthscale/component-actions";

import { NextButton } from "#carousel/bound.ts";
import { useCarousel } from "#carousel/machine.ts";
import { stepping } from "#carousel/stepping.ts";

/**
 * Describes the props of the next trigger: its accessible name and the props of a `Button`.
 */
export interface NextTriggerProps extends ButtonProps {
  /**
   * Accessible name of the trigger, "Next slide" unless the caller passes another.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the next trigger with the machine's props merged under the caller's.
 *
 * @param props - The trigger's name and the props of a `Button`.
 * @returns The `button` element.
 */
export function NextTrigger({ label = "Next slide", ...rest }: NextTriggerProps): ReactElement {
  const machine = useCarousel();
  const { api } = machine;
  const props = stepping(machine, api.getNextTriggerProps(), !api.canScrollNext, "PAGE.NEXT");

  return <NextButton {...mergeProps(props, rest)} aria-label={label} shape="square" />;
}
