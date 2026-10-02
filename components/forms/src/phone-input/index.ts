/**
 * Exports the phone input's parts, composed as `PhoneInput.Root` around a country picker and the
 * number, and the types its props and callbacks read.
 */

export { type CountryCode } from "libphonenumber-js";

export { Country, type CountryProps } from "#phone-input/country.tsx";
export { Input, type InputProps } from "#phone-input/input.tsx";
export { type ValueChangeDetails } from "#phone-input/number.ts";
export { type CountryChangeDetails, type PhoneOptions } from "#phone-input/phone.ts";
export { Root, type RootProps } from "#phone-input/root.tsx";
