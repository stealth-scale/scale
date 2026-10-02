/**
 * Writes a chart's values the way a locale writes them, for recharts' tick formatters and the
 * tooltip.
 *
 * @remarks
 *   An axis calls its formatter once per tick on every render, so each formatter is built once per
 *   locale and options and kept.
 */

/**
 * Keeps the number formats built, keyed by locale and options.
 */
const NUMBERS = new Map<string, Intl.NumberFormat>();

/**
 * Keeps the date formats built, keyed by locale and options.
 */
const DATES = new Map<string, Intl.DateTimeFormat>();

/**
 * Returns a string unchanged and an empty string for any other value.
 */
function textOf(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Returns whether a value is a pair of numbers, the two ends of a band.
 */
function isPair(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

/**
 * Returns a function that writes a number in the locale, a pair of numbers as a range, and a
 * string as it is.
 *
 * @remarks
 *   The tooltip receives a band's value as its two ends. `Intl.NumberFormat`'s `formatRange` writes
 *   them the way the locale writes a range: "€3.00 – €5.00" in English, "1.200–3.400" in German.
 * @param locale - The locale the numbers are written in.
 * @param options - `Intl.NumberFormat`'s options, such as a currency.
 */
export function numberFormatter(
  locale: string,
  options: Intl.NumberFormatOptions = {},
): (value: unknown) => string {
  const key = `${locale}|${JSON.stringify(options)}`;
  const format = NUMBERS.get(key) ?? new Intl.NumberFormat(locale, options);

  NUMBERS.set(key, format);

  return (value) => {
    if (isPair(value)) return format.formatRange(value[0], value[1]);

    return typeof value === "number" ? format.format(value) : textOf(value);
  };
}

/**
 * Returns a function that writes an instant in the locale: a `Date`, a timestamp or a string a
 * `Date` reads. A string that is no date comes back as it is.
 *
 * @param locale - The locale the dates are written in.
 * @param options - `Intl.DateTimeFormat`'s options, such as a short month.
 */
export function dateFormatter(
  locale: string,
  options: Intl.DateTimeFormatOptions = {},
): (value: unknown) => string {
  const key = `${locale}|${JSON.stringify(options)}`;
  const format = DATES.get(key) ?? new Intl.DateTimeFormat(locale, options);

  DATES.set(key, format);

  return (value) => {
    const at =
      value instanceof Date || typeof value === "number" || typeof value === "string"
        ? new Date(value)
        : undefined;

    return at === undefined || Number.isNaN(at.getTime()) ? textOf(value) : format.format(at);
  };
}
