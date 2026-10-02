/**
 * Reads a field's settings out of the `options` its presentation states and the bounds its schema
 * states: how a number is formatted, stepped and bounded, how many lines a long text shows, the
 * countries a phone number is read in, and a masked value's pattern.
 *
 * @remarks
 *   A plugin can write a presentation's `options`, so every setting is checked before a control
 *   reads it. A value of the wrong type is left out. A number format that `Intl.NumberFormat`
 *   refuses, such as a currency style without a currency, is left out whole, and so is a country
 *   the phone metadata does not know.
 */

import { type CountryCode, isSupportedCountry } from "libphonenumber-js";

import { omitUndefined } from "@stealthscale/hooks";
import { type Schema } from "@stealthscale/provider-form";

/**
 * Describes how a number field formats and steps its value.
 */
export interface NumberSettings {
  /**
   * How the input formats the number, as `Intl.NumberFormat` reads it.
   */
  readonly formatOptions?: Intl.NumberFormatOptions;

  /**
   * How far an arrow key or a stepper moves the value.
   */
  readonly step?: number;
}

/**
 * Describes how many lines a long text field shows.
 */
export interface TextareaSettings {
  /**
   * Most lines the field grows to before it scrolls.
   */
  readonly maxRows?: number;

  /**
   * Least lines the field shows.
   */
  readonly rows?: number;
}

/**
 * Describes the countries a phone field offers and reads a number in.
 */
export interface PhoneSettings {
  /**
   * Countries the picker offers, in order.
   */
  readonly countries?: readonly CountryCode[];

  /**
   * Country a number without a `+` prefix is read in.
   */
  readonly defaultCountry?: CountryCode;
}

/**
 * Describes the options a presentation states for one field.
 */
type Options = Readonly<Record<string, unknown>> | undefined;

/**
 * Lists the styles `Intl.NumberFormat` formats a number in.
 */
const STYLES = ["currency", "decimal", "percent", "unit"] as const;

/**
 * Reads a string setting, or nothing for a value of another type.
 */
function stringOf(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/**
 * Reads a style setting, or nothing for a value that is not one of the styles.
 */
function styleOf(value: unknown): (typeof STYLES)[number] | undefined {
  return STYLES.find((style) => style === value);
}

/**
 * Reads a count of digits or lines: a whole number no smaller than `least`, or nothing.
 */
function countOf(value: unknown, least: number): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value >= least ? value : undefined;
}

/**
 * Reads a step, or nothing for a value that is not a finite number above zero.
 */
function stepOf(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * Builds the number format the options state, or nothing where they state none or
 * `Intl.NumberFormat` refuses the one they state.
 */
function formatOf(options: Options): Intl.NumberFormatOptions | undefined {
  const format: Intl.NumberFormatOptions = omitUndefined({
    currency: stringOf(options?.["currency"]),
    maximumFractionDigits: countOf(options?.["maximumFractionDigits"], 0),
    minimumFractionDigits: countOf(options?.["minimumFractionDigits"], 0),
    style: styleOf(options?.["style"]),
    unit: stringOf(options?.["unit"]),
  });

  if (Object.keys(format).length === 0) return undefined;

  try {
    new Intl.NumberFormat(undefined, format).format(0);
  } catch {
    return undefined;
  }

  return format;
}

/**
 * Reads a number field's settings: `style`, `currency`, `unit`, `minimumFractionDigits` and
 * `maximumFractionDigits` for the format, and `step`.
 *
 * @param options - The options the field's presentation states, or nothing.
 * @returns The settings the options state that a number input takes.
 */
export function numberSettingsOf(options?: Options): NumberSettings {
  return omitUndefined({ formatOptions: formatOf(options), step: stepOf(options?.["step"]) });
}

/**
 * Reads a long text field's settings: `rows` and `maxRows`, each a whole number of one or more.
 *
 * @param options - The options the field's presentation states, or nothing.
 * @returns The settings the options state that a textarea takes.
 */
export function textareaSettingsOf(options?: Options): TextareaSettings {
  return omitUndefined({
    maxRows: countOf(options?.["maxRows"], 1),
    rows: countOf(options?.["rows"], 1),
  });
}

/**
 * Reads one bound off a schema: the number it states, or nothing.
 *
 * @param schema - The field's schema, or nothing.
 * @param keyword - The bound to read.
 * @returns The bound, or nothing where the schema states no number for it.
 */
export function boundOf(
  schema: Schema | undefined,
  keyword: "maximum" | "minimum",
): number | undefined {
  const bound = schema?.[keyword];

  return typeof bound === "number" ? bound : undefined;
}

/**
 * Reads a country the phone metadata knows, or nothing for any other value.
 */
function countryOf(value: unknown): CountryCode | undefined {
  return typeof value === "string" && isSupportedCountry(value) ? value : undefined;
}

/**
 * Reads a phone field's settings: `country`, the country a number without a `+` prefix is read
 * in, and `countries`, the countries the picker offers. A country the metadata does not know is
 * left out of the list.
 *
 * @param options - The options the field's presentation states, or nothing.
 * @returns The settings the options state that a phone input takes.
 */
export function phoneSettingsOf(options?: Options): PhoneSettings {
  const listed = options?.["countries"];
  const countries = Array.isArray(listed)
    ? listed.map((value) => countryOf(value)).filter((country) => country !== undefined)
    : [];

  return omitUndefined({
    countries: countries.length > 0 ? countries : undefined,
    defaultCountry: countryOf(options?.["country"]),
  });
}

/**
 * Reads a masked field's pattern, `mask`: a string in the input mask's tokens, or nothing.
 *
 * @param options - The options the field's presentation states, or nothing.
 * @returns The pattern, or nothing where the options state no string under `mask`.
 */
export function maskOf(options?: Options): string | undefined {
  return stringOf(options?.["mask"]);
}
