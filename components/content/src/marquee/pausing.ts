/**
 * Decides whether a marquee is paused, from the reader's choice through the pause control, and
 * from the pointer and the keyboard focus.
 *
 * @remarks
 *   WCAG 2.2.2 asks for a pause that lasts until the reader undoes it. The machine's pause on
 *   interaction writes the same state as its pause, so a pointer leaving the marquee resumed a
 *   marquee the reader had paused. Here the reader's choice is apart: the pause control sets it,
 *   and under `pauseOnInteraction` a pointer over the marquee or focus inside it pauses the marquee
 *   only while it is there.
 */

import { type ComponentProps, useState } from "react";

import { type PauseStatusDetails } from "@zag-js/marquee";

import { useControllableState } from "@stealthscale/hooks";

/**
 * Describes the settings of the pause: the reader's choice, controlled or not, and whether the
 * pointer and the focus pause the marquee.
 */
export interface PausingOptions {
  /**
   * Whether the marquee starts paused, for an uncontrolled choice.
   */
  readonly defaultPaused?: boolean | undefined;

  /**
   * Called when the reader's choice changes.
   */
  readonly onPauseChange?: ((details: PauseStatusDetails) => void) | undefined;

  /**
   * Whether the reader chose to pause the marquee, for a controlled choice.
   */
  readonly paused?: boolean | undefined;

  /**
   * Whether a pointer over the marquee or focus inside it pauses it while it is there.
   */
  readonly pauseOnInteraction?: boolean | undefined;
}

/**
 * Describes what the parts read from the pause.
 */
export interface Pausing {
  /**
   * Whether the reader chose to pause the marquee, apart from a pause under the pointer.
   */
  readonly chosen: boolean;

  /**
   * Handlers the root merges, which track the pointer and the focus.
   */
  readonly handlers: Pick<
    ComponentProps<"div">,
    "onBlur" | "onFocus" | "onPointerEnter" | "onPointerLeave"
  >;

  /**
   * Whether the machine holds the marquee: the reader's choice, or an interaction under
   * `pauseOnInteraction`.
   */
  readonly paused: boolean;

  /**
   * Reverses the reader's choice, as a press on the pause control does.
   */
  readonly toggle: () => void;
}

/**
 * Returns whether the marquee is paused and the handlers that pause it.
 *
 * @param options - The reader's choice, its callback and whether the pointer and the focus pause
 *   the marquee.
 */
export function usePausing(options: PausingOptions): Pausing {
  const [chosen, setChosen] = useControllableState({
    defaultValue: options.defaultPaused ?? false,
    onChange: (paused: boolean) => {
      options.onPauseChange?.({ paused });
    },
    value: options.paused,
  });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const interacting = options.pauseOnInteraction === true && (hovered || focused);

  return {
    chosen,
    handlers: {
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      },
      onFocus: () => {
        setFocused(true);
      },
      onPointerEnter: () => {
        setHovered(true);
      },
      onPointerLeave: () => {
        setHovered(false);
      },
    },
    paused: chosen || interacting,
    toggle: () => {
      setChosen((previous) => !previous);
    },
  };
}
