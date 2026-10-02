/**
 * Provides the state the root shares with the input.
 *
 * @remarks
 *   The root stores the value, resolves the mask, and resolves the states from its props, the field
 *   and the fieldset. The input reads the three, because the input is the element that shows the
 *   value, takes the edits and sets the state attributes the input group's box reads.
 */

import { createRequiredContext } from "@stealthscale/hooks";

import { type Masker } from "#input-mask/mask.ts";

/**
 * Describes the state the root shares with the input.
 */
export interface Masking {
  /**
   * Whether the input is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Whether the value is invalid.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Resolved mask.
   */
  readonly masker: Masker;

  /**
   * Name the input submits its value under.
   */
  readonly name: string | undefined;

  /**
   * Whether the input is read-only.
   */
  readonly readOnly?: boolean | undefined;

  /**
   * Whether the input requires a value.
   */
  readonly required?: boolean | undefined;

  /**
   * Stores a value and reports it to the root's callbacks.
   */
  readonly set: (value: string) => void;

  /**
   * Value the input shows.
   */
  readonly value: string;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useMasking` throws for an input rendered outside `InputMask.Root`.
 */
export const [MaskingProvider, useMasking] = createRequiredContext<Masking>("InputMask");
