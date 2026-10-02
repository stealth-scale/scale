/**
 * Provides the picker's choice handler to the choices inside it.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what the picker provides: the handler a choice calls with its value.
 */
export interface PickerState {
  /**
   * Reports the value chosen and closes the picker.
   */
  readonly choose: (value: string) => void;
}

/**
 * Provides the picker's state to the choices, and reads it where a choice renders.
 */
export const [PickerProvider, usePickerState] =
  createRequiredContext<PickerState>("Reactions.Picker");
