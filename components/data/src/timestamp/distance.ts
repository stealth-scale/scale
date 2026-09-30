/**
 * Words the distance between two instants.
 */

/**
 * Lists the units of a distance with their length in milliseconds, longest first.
 *
 * @remarks
 *   A month is 30 days and a year 365. A distance is rounded to its unit anyway: "8 months ago"
 *   states how long ago, and the exact instant is in the element's `dateTime`.
 */
const UNITS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["week", 604_800_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
  ["second", 1000],
];

/**
 * Returns the distance from one instant to another in the largest unit that counts at least one,
 * worded in the locale.
 *
 * @remarks
 *   The count is truncated, so 2 hours and 59 minutes reads "2 hours ago". `numeric: "auto"` words
 *   a distance of one day as "yesterday" or "tomorrow" and a distance under a second as "now".
 * @param at - The instant read.
 * @param from - The instant it is measured from.
 * @param locale - The locale of the words.
 */
export function distanceOf(at: Date, from: Date, locale: string): string {
  const apart = at.getTime() - from.getTime();
  const words = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const unit = UNITS.find(([, length]) => Math.abs(apart) >= length);

  return unit === undefined
    ? words.format(0, "second")
    : words.format(Math.trunc(apart / unit[1]), unit[0]);
}
