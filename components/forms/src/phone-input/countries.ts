/**
 * Lists the countries a phone input offers, each with its name in the locale and its calling code.
 *
 * @remarks
 *   A country is a region code, such as `NL`, and never a calling code: `+1` is the code of 25
 *   countries. Its name comes from `Intl.DisplayNames` in the locale, so a caller passes codes and
 *   no translations, and `nameOf` replaces a name where the caller has its own. Without a list the
 *   input offers every region `libphonenumber-js` has metadata for, 245 in 1.13.14, sorted by name
 *   in the locale. A list the caller passes keeps the caller's order.
 */

import { type CountryCode, getCountries, getCountryCallingCode } from "libphonenumber-js";

/**
 * Describes a country a phone input offers.
 */
export interface Country {
  /**
   * Region code, such as `NL`.
   */
  readonly code: CountryCode;

  /**
   * Calling code with its `+`, such as `+31`.
   */
  readonly dial: string;

  /**
   * Name in the locale, or the caller's name for it.
   */
  readonly name: string;
}

/**
 * Returns the calling code of a country with its `+`, such as `+31`.
 */
export function dialOf(code: CountryCode): string {
  return `+${getCountryCallingCode(code)}`;
}

/**
 * Returns the countries a phone input offers: the caller's in its order, else every region sorted
 * by name.
 *
 * @param locale - Locale the names are written in.
 * @param codes - Regions the caller offers, in order, or nothing for every region.
 * @param nameOf - The caller's name for a region, or undefined to keep the locale's.
 */
export function countriesOf(
  locale: string,
  codes?: readonly CountryCode[],
  nameOf?: (code: CountryCode) => string | undefined,
): Country[] {
  const names = new Intl.DisplayNames([locale], { fallback: "code", type: "region" });
  const listed = (codes ?? getCountries()).map((code) => ({
    code,
    dial: dialOf(code),
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- With the code fallback, a display name is the region code where the locale has no name.
    name: nameOf?.(code) ?? (names.of(code) as string),
  }));

  if (codes !== undefined) return listed;

  const collator = new Intl.Collator(locale);

  return listed.toSorted((first, second) => collator.compare(first.name, second.name));
}
