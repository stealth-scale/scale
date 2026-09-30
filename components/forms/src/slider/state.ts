/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The thumbs name themselves after `Slider.Label` only while a label is mounted, because an ID
 *   reference to an element that does not exist is invalid. Without the label part they take the
 *   label of a field or the legend of a fieldset around the slider. The root formats every value
 *   once, so the value text, the thumbs' `aria-valuetext` and the dragging indicator read the same
 *   words. A thumb provides its position to the dragging indicator inside it.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("Slider");

/**
 * Describes the state the root shares with the parts.
 */
export interface Shared {
  /**
   * IDs of the texts that describe the thumbs, or nothing outside a field.
   */
  readonly described: string | undefined;

  /**
   * Returns a value in the words the root formats it in.
   */
  readonly format: (value: number) => string;

  /**
   * Whether the root states `formatOptions`, so each thumb sets its formatted value as
   * `aria-valuetext`.
   */
  readonly formatted: boolean;

  /**
   * ID of the element that names the thumbs, or nothing without a label, a field or a legend.
   */
  readonly label: string | undefined;

  /**
   * Whether the value is read-only, so a thumb dashes its edge.
   */
  readonly readOnly: boolean;

  /**
   * Returns the ID of the thumb at a position.
   */
  readonly thumbId: (index: number) => string;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("Slider");

/**
 * Provides a thumb's position to the parts inside it, and reads it back.
 *
 * @remarks
 *   `useThumbIndex` throws for a dragging indicator rendered outside `Slider.Thumb`.
 */
export const [ThumbProvider, useThumbIndex] = createRequiredContext<number>("Slider.Thumb");
