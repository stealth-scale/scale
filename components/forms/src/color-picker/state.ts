/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The text input in the control, the trigger and the panel name themselves after
 *   `ColorPicker.Label` only while a label is mounted, because an ID reference to an element that
 *   does not exist is invalid. Without the label part they name themselves after the label of a
 *   field around the picker. Without either the trigger takes the caller's `aria-label` and reports
 *   it to the root, and the panel takes the same name.
 */

import { type Color } from "@zag-js/color-utils";

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

import { type Ids } from "#color-picker/machine.ts";
import { createNaming, type Names } from "#naming.ts";

export { namesOf } from "#naming.ts";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("ColorPicker");

/**
 * Provides the setter the trigger reports its `aria-label` through, and the hook the trigger
 * calls.
 *
 * @remarks
 *   `useNamed` throws for a trigger rendered outside a root.
 */
export const [NamingProvider, useNamed] = createNaming("ColorPicker");

/**
 * Describes the state the root shares with the parts: the names, the IDs, the locale, the
 * direction, the states the text input in the control reports, and the setter a slider's thumb
 * calls.
 */
export interface Shared extends Names {
  /**
   * Sets the color in the format it is passed in, unless the picker is disabled or read-only.
   */
  readonly change: (color: Color) => void;

  /**
   * IDs the parts name and find each other by.
   */
  readonly ids: Ids;

  /**
   * Whether the picker is invalid, which the text input in the control reports as `aria-invalid`.
   */
  readonly invalid: boolean;

  /**
   * Locale the channel values are formatted in for assistive technology.
   */
  readonly locale: string;

  /**
   * Whether a form requires a color, which the text input in the control reports as
   * `aria-required`.
   */
  readonly required: boolean;

  /**
   * Whether the picker lays out right to left, where ArrowRight moves a slider's thumb towards
   * the start of its channel.
   */
  readonly rtl: boolean;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("ColorPicker");
