/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The thumb names itself after `AngleSlider.Label` only while a label is mounted, because an ID
 *   reference to an element that does not exist is invalid. Without the label part it takes the
 *   label of a field or the legend of a fieldset around the dial. The root formats the value once,
 *   so the value text and the thumb's `aria-valuetext` read the same words. The thumb reads the
 *   step, the reading direction and `send` to map its keys.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

import { type KeyEvent } from "#angle-slider/keys.ts";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("AngleSlider");

/**
 * Describes the state the root shares with the parts.
 */
export interface Shared {
  /**
   * IDs of the texts that describe the thumb, or nothing outside a field.
   */
  readonly described: string | undefined;

  /**
   * Reading direction the machine runs in, which swaps ArrowLeft and ArrowRight.
   */
  readonly dir: "ltr" | "rtl";

  /**
   * Whether the dial is disabled, so the thumb sets `aria-disabled`.
   */
  readonly disabled: boolean;

  /**
   * Returns a value in the words the root formats it in.
   */
  readonly format: (value: number) => string;

  /**
   * Whether a person can change the value: neither disabled nor read-only.
   */
  readonly interactive: boolean;

  /**
   * ID of the element that names the thumb, or nothing without a label, a field or a legend.
   */
  readonly label: string | undefined;

  /**
   * Sends the machine the event for a key pressed on the thumb.
   */
  readonly send: (event: KeyEvent) => void;

  /**
   * The machine's step, in degrees.
   */
  readonly step: number;

  /**
   * ID of the thumb.
   */
  readonly thumbId: string;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("AngleSlider");
