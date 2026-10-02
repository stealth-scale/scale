/**
 * Builds the phone inputs the part specifications render.
 */

import { type ReactElement } from "react";

import { screen } from "@testing-library/react";

import { Country, type CountryProps } from "#phone-input/country.tsx";
import { Input } from "#phone-input/input.tsx";
import { Root, type RootProps } from "#phone-input/root.tsx";

/**
 * Countries every case offers, in the picker's order.
 */
export const OFFERED = ["NL", "BE", "GB", "US"] as const;

/**
 * Renders a phone input read in the Netherlands, with the picker unless the case passes `null` for
 * it, and the props the case sets on the root and the picker.
 *
 * @param props - The props of the root.
 * @param country - The props of the picker, or `null` for a phone input without one.
 * @returns The phone input.
 */
export function phoned(
  props: Partial<RootProps> = {},
  country: null | Partial<CountryProps> = {},
): ReactElement {
  return (
    <Root countries={[...OFFERED]} defaultCountry="NL" locale="en" {...props}>
      {country === null ? null : <Country label="Country" {...country} />}
      <Input aria-label="Phone number" />
    </Root>
  );
}

/**
 * Returns the number's input, found by its name.
 *
 * @returns The `input` element.
 */
export function number(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox", { name: "Phone number" });
}
