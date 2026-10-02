/**
 * Provides the state the phone input's root shares with its input and its country picker.
 *
 * @remarks
 *   The root shares the number, the picked country and the countries on offer from `usePhone`,
 *   and the states it resolves from its props, a field and a fieldset. The input reports each edit
 *   to the root, and the picker reports each pick. The picker reports itself while it renders,
 *   because the root moves the picked country to the one a typed `+` prefix names only while a
 *   picker shows the country.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";
import { type Scale } from "@stealthscale/theme/authoring";

import { type Phone } from "#phone-input/phone.ts";

/**
 * Describes the state the root shares with its parts: the number and the country, and the states.
 */
export interface Phoning extends Omit<Phone, "setPicking" | "value"> {
  /**
   * Whether the input is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Whether the number is invalid.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Whether the input is read-only.
   */
  readonly readOnly?: boolean | undefined;

  /**
   * Whether the input requires a number.
   */
  readonly required?: boolean | undefined;

  /**
   * Size of the input group's box, which the picker takes.
   */
  readonly size?: Scale | undefined;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `usePhoning` throws for a part rendered outside `PhoneInput.Root`.
 */
export const [PhoningProvider, usePhoning] = createRequiredContext<Phoning>("PhoneInput.Root");

/**
 * Provides the setter through which the country picker reports that it renders, and the hook the
 * picker calls.
 */
export const [PickingProvider, usePicking] = createLabelling("PhoneInput.Root");
