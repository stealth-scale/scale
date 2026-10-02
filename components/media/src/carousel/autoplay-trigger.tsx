/**
 * Renders the rotation control, the button that starts and stops the carousel's rotation.
 *
 * @remarks
 *   The element is the library's square `Button`. Its name states the action a press takes: "Stop
 *   slide rotation" while the carousel rotates by choice, "Start slide rotation" otherwise, unless
 *   the caller passes `stopLabel` and `startLabel`. The name follows the reader's choice, not a
 *   pause under the pointer, so the control keeps its name while the pointer rests on it. The
 *   machine's `data-pressed` is dropped, because the name states the state and a pressed look would
 *   state it twice. The APG carousel pattern puts the control first among the carousel's controls
 *   in the tab order.
 */

import { type MouseEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { type ButtonProps } from "@stealthscale/component-actions";

import { AutoplayButton, lookOf } from "#carousel/bound.ts";
import { useCarousel } from "#carousel/machine.ts";

/**
 * Describes the props of the rotation control: the names of its two actions and the props of a
 * `Button`.
 */
export interface AutoplayTriggerProps extends ButtonProps {
  /**
   * Name of the control while the carousel does not rotate, "Start slide rotation" unless the
   * caller passes another.
   */
  readonly startLabel?: string | undefined;

  /**
   * Name of the control while the carousel rotates, "Stop slide rotation" unless the caller passes
   * another.
   */
  readonly stopLabel?: string | undefined;
}

/**
 * Renders the rotation control with the machine's props merged under the caller's.
 *
 * @param props - The names of the two actions and the props of a `Button`.
 * @returns The `button` element.
 */
export function AutoplayTrigger({
  startLabel = "Start slide rotation",
  stopLabel = "Stop slide rotation",
  ...rest
}: AutoplayTriggerProps): ReactElement {
  const { api, controls, rotation } = useCarousel();
  const pressed = {
    /**
     * Reverses the reader's choice unless the caller cancelled the press, and stops the machine's
     * own press handler.
     */
    onClick(event: MouseEvent<HTMLButtonElement>): void {
      if (event.defaultPrevented) return;

      event.preventDefault();
      rotation.toggle();
    },
    variant: lookOf(controls),
  };

  return (
    <AutoplayButton
      {...mergeProps(api.getAutoplayTriggerProps(), pressed, rest)}
      aria-label={rotation.wanted ? stopLabel : startLabel}
      data-pressed={undefined}
      shape="square"
    />
  );
}
