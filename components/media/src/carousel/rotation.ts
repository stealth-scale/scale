/**
 * Decides whether a carousel rotates, from the root's `autoplay`, the reader's motion setting, the
 * rotation control, the pointer and the keyboard focus.
 *
 * @remarks
 *   The rules follow the APG carousel pattern. The reader's choice through the rotation control
 *   decides, and until the reader makes one the root's `autoplay` decides, unless the reader asks
 *   the system for reduced motion. Keyboard focus that enters the carousel from outside counts as a
 *   choice to stop, so the rotation does not restart until the reader starts it again. A pointer
 *   over the carousel pauses the rotation until it leaves, unless the reader started the rotation
 *   with the control. Focus that a pointer press moves into the carousel does not count, because
 *   the pointer already pauses the rotation.
 */

import { type ComponentProps, useState } from "react";

import { type Props } from "@zag-js/carousel";

/**
 * Describes the root's `autoplay`: off, on at the machine's 4000ms, or on at a delay.
 */
export type Autoplay = Props["autoplay"];

/**
 * Describes what the root reads from the rotation: the machine's setting, the handlers that track
 * the pointer and the focus, and the rotation control's state and press.
 */
export interface Rotation {
  /**
   * Setting the machine receives: the root's `autoplay` while the carousel rotates, else `false`.
   */
  readonly autoplay: NonNullable<Autoplay>;

  /**
   * Handlers the root merges, which track the pointer and the keyboard focus.
   */
  readonly handlers: Pick<ComponentProps<"div">, "onFocus" | "onPointerEnter" | "onPointerLeave">;

  /**
   * Reverses the reader's choice, as a press on the rotation control does.
   */
  readonly toggle: () => void;

  /**
   * Whether the reader's or the root's choice is to rotate, apart from a pause under the pointer.
   */
  readonly wanted: boolean;
}

/**
 * Returns whether the carousel rotates and the handlers that pause and stop it.
 *
 * @param requested - The root's `autoplay`.
 * @param reduced - Whether the reader asks the system for reduced motion.
 * @returns The machine's setting, the handlers and the rotation control's state and press.
 */
export function useRotation(requested: Autoplay, reduced: boolean): Rotation {
  const [choice, setChoice] = useState<boolean>();
  const [hovered, setHovered] = useState(false);
  const wanted = choice ?? (Boolean(requested) && !reduced);
  const rotating = wanted && (choice === true || !hovered);
  const setting = typeof requested === "object" ? requested : true;

  return {
    autoplay: rotating && setting,
    handlers: {
      /**
       * Stops the rotation when keyboard focus enters the carousel from outside.
       */
      onFocus(event) {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        if (event.target.matches(":focus-visible")) setChoice(false);
      },

      /**
       * Pauses the rotation while the pointer is over the carousel.
       */
      onPointerEnter() {
        setHovered(true);
      },

      /**
       * Ends the pause once the pointer leaves the carousel.
       */
      onPointerLeave() {
        setHovered(false);
      },
    },

    /**
     * Records the reader's choice as the opposite of the one in force.
     */
    toggle() {
      setChoice(!wanted);
    },
    wanted,
  };
}
