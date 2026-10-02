/**
 * Formats a phone number as a person types it, and derives its E.164 form and its country.
 *
 * @remarks
 *   A number keeps its digits and a leading `+`, and `AsYouType` from `libphonenumber-js` formats
 *   them for the country, or for the country a `+` prefix names. Every other character is dropped,
 *   because the formatter stops at the first letter it reads. A number is valid once
 *   `libphonenumber-js` validates it, and its value is then the E.164 form, such as
 *   `+31612345678`, the one form two records of one phone share. A number that is not valid keeps
 *   the text it shows as its value, so a draft returns to the field unchanged. A country the
 *   formatter detects is reported only once the prefix names one country: `+1` names 25.
 */

import { AsYouType, type CountryCode, getCountryCallingCode } from "libphonenumber-js";

/**
 * Describes a number after a change: the value to store, the text shown, whether it is valid and
 * the country it is in.
 */
export interface ValueChangeDetails {
  /**
   * Country the number is in: the one its `+` prefix names, the picked one for a number without a
   * `+`, or nothing while the prefix names several.
   */
  readonly country: CountryCode | undefined;

  /**
   * Text the input shows.
   */
  readonly text: string;

  /**
   * Whether the number is valid for its country.
   */
  readonly valid: boolean;

  /**
   * E.164 form of a valid number, else the text the input shows.
   */
  readonly value: string;
}

/**
 * Describes a formatted number: its text, the country its prefix names and its details.
 */
export interface Formatted extends ValueChangeDetails {
  /**
   * Country the `+` prefix names, or nothing while the prefix names none or several.
   */
  readonly detected: CountryCode | undefined;

  /**
   * Digits of the number without its country calling code or trunk prefix.
   */
  readonly national: string;
}

/**
 * Returns the characters of a number: its digits, after a `+` where the text starts with one.
 */
export function charactersOf(text: string): string {
  const digits = text.replaceAll(/\D/gu, "");

  return text.trimStart().startsWith("+") ? `+${digits}` : digits;
}

/**
 * Returns a number formatted for a country, with its value, validity and the country its prefix
 * names.
 *
 * @param text - The text a person typed or a caller stored.
 * @param country - Country a number without a `+` prefix is read in, or nothing.
 */
export function formatOf(text: string, country?: CountryCode): Formatted {
  const typer = new AsYouType(country);
  const shown = typer.input(charactersOf(text));
  const detected = typer.getCountry();
  const number = typer.getNumberValue();
  const valid = number !== undefined && typer.isValid();

  return {
    country: detected ?? (typer.isInternational() ? undefined : country),
    detected,
    national: typer.getNationalNumber(),
    text: shown,
    valid,
    value: valid ? number : shown,
  };
}

/**
 * Returns a number's text rewritten in the international form of another country, such as
 * `+44 612345678` for `06 12345678` moved from the Netherlands to the United Kingdom.
 *
 * @remarks
 *   The national form of the other country is not an option: the national number `612345678`
 *   formatted for the Netherlands again has lost its trunk `0` and its grouping. A number without
 *   digits returns empty.
 * @param text - The text the input shows.
 * @param from - Country the text is read in.
 * @param to - Country the number moves to.
 */
export function movedTo(text: string, from: CountryCode | undefined, to: CountryCode): string {
  const { national } = formatOf(text, from);

  if (national === "") return "";

  return formatOf(`+${getCountryCallingCode(to)}${national}`).text;
}
