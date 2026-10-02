/**
 * Stores a phone input's number and country, and derives the text to show and the value to report.
 *
 * @remarks
 *   The text the input shows is stored beside the value last reported for it, so a caller that
 *   stores the reported E.164 form and passes it back as `value` keeps the text the person typed,
 *   and any other `value` shows formatted for the picked country. A number a typed `+` prefix
 *   places in an offered country moves the picked country there while a picker renders. A picked
 *   country rewrites the digits in its international form. The countries are named in `locale`,
 *   else the locale in scope, else the runtime's.
 */

import { use, useState } from "react";

import { type CountryCode } from "libphonenumber-js";

import { useControllableState } from "@stealthscale/hooks";
import { LocaleContext } from "@stealthscale/provider-locale";

import { countriesOf, type Country } from "#phone-input/countries.ts";
import { formatOf, type Formatted, movedTo, type ValueChangeDetails } from "#phone-input/number.ts";

/**
 * Describes the country a picker or a typed prefix moved the number to.
 */
export interface CountryChangeDetails {
  /**
   * Region code of the country, such as `GB`.
   */
  readonly country: CountryCode;
}

/**
 * Describes the number's options: its value, its country, the countries on offer, the locale and
 * the callbacks.
 */
export interface PhoneOptions {
  /**
   * Countries the picker offers, in order. Every region, sorted by name, unless stated.
   */
  readonly countries?: readonly CountryCode[] | undefined;

  /**
   * Controlled country a number without a `+` prefix is read in.
   */
  readonly country?: CountryCode | undefined;

  /**
   * Country a number without a `+` prefix is read in, while the caller does not control it.
   */
  readonly defaultCountry?: CountryCode | undefined;

  /**
   * Initial number while the caller does not control it: E.164 or a national number.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Locale the countries are named and sorted in.
   */
  readonly locale?: string | undefined;

  /**
   * Returns the caller's name for a country, or undefined to keep the locale's.
   */
  readonly nameOf?: ((country: CountryCode) => string | undefined) | undefined;

  /**
   * Called with the country a picker or a typed prefix moved the number to.
   */
  readonly onCountryChange?: ((details: CountryChangeDetails) => void) | undefined;

  /**
   * Called with the value, the text, whether the number is valid and its country, on every change.
   */
  readonly onValueChange?: ((details: ValueChangeDetails) => void) | undefined;

  /**
   * Controlled number: the value `onValueChange` reported, E.164 or a national number.
   */
  readonly value?: string | undefined;
}

/**
 * Describes the number the root shares: the text, the country, the countries on offer, and the
 * functions an edit and a pick call.
 */
export interface Phone {
  /**
   * Countries the picker offers, in the order it lists them.
   */
  readonly countries: readonly Country[];

  /**
   * Picked country, or nothing while none is picked.
   */
  readonly country: CountryCode | undefined;

  /**
   * Stores an edit the input formatted and reports it.
   */
  readonly edit: (formatted: Formatted) => void;

  /**
   * Picks a country and rewrites the digits in its international form.
   */
  readonly pick: (country: CountryCode) => void;

  /**
   * Records whether a picker renders.
   */
  readonly setPicking: (picking: boolean) => void;

  /**
   * Text the input shows.
   */
  readonly text: string;

  /**
   * Value the number submits: the E.164 form once it is valid, else the text.
   */
  readonly value: string;
}

/**
 * Describes the text the input shows and the value last reported for it.
 */
interface Shown {
  /**
   * Value last reported.
   */
  readonly reported: string;

  /**
   * Text the input shows.
   */
  readonly text: string;
}

/**
 * Stores the number and the country, and returns what the parts read and call.
 *
 * @param options - The value, the country, the countries, the locale and the callbacks.
 */
export function usePhone(options: PhoneOptions): Phone {
  const { countries, country, defaultCountry, defaultValue = "", locale, nameOf, value } = options;
  const scoped = use(LocaleContext);
  const [picking, setPicking] = useState(false);
  const [region, setRegion] = useControllableState({
    defaultValue: defaultCountry,
    value: country,
  });
  const [shown, setShown] = useState<Shown>(() => {
    const { text, value: reported } = formatOf(defaultValue, country ?? defaultCountry);

    return { reported, text };
  });
  const offered = countriesOf(
    locale ?? scoped?.locale ?? new Intl.NumberFormat().resolvedOptions().locale,
    countries,
    nameOf,
  );
  const text =
    value === undefined || value === shown.reported ? shown.text : formatOf(value, region).text;

  /**
   * Stores a formatted number and reports it.
   */
  const report = (formatted: Formatted): void => {
    setShown({ reported: formatted.value, text: formatted.text });
    options.onValueChange?.({
      country: formatted.country,
      text: formatted.text,
      valid: formatted.valid,
      value: formatted.value,
    });
  };

  /**
   * Moves the number to a country and reports the country.
   */
  const move = (next: CountryCode): void => {
    setRegion(next);
    options.onCountryChange?.({ country: next });
  };

  return {
    countries: offered,
    country: region,
    edit: (formatted) => {
      const { detected } = formatted;

      report(formatted);

      if (!picking || detected === undefined || detected === region) return;
      if (offered.some((each) => each.code === detected)) move(detected);
    },
    pick: (next) => {
      const moved = movedTo(text, region, next);

      move(next);

      if (moved !== "") report(formatOf(moved, next));
    },
    setPicking,
    text,
    value: formatOf(text, region).value,
  };
}
