/**
 * Returns the time zone a date component formats its dates in.
 *
 * @remarks
 *   The date input and the date picker machines format in `timeZone`, UTC by default, and keep a
 *   `ZonedDateTime`'s fields in the value's own zone, so a segment's or a day's text matches its
 *   value only while the two zones are one. React Aria's date field formats in the value's zone by
 *   the same rule.
 */

import { type DateValue } from "@internationalized/date";

/**
 * Describes the options a zone is read from: the dates the component starts with and the zone the
 * caller states.
 */
export interface Zoned {
  /**
   * Date the component reads while it has no value, which the caller does not keep.
   */
  readonly defaultPlaceholderValue?: DateValue | undefined;

  /**
   * Dates the component starts with.
   */
  readonly defaultValue?: DateValue[] | undefined;

  /**
   * Date the component reads while it has no value, which the caller keeps.
   */
  readonly placeholderValue?: DateValue | undefined;

  /**
   * Zone the caller states, which every other option gives way to.
   */
  readonly timeZone?: string | undefined;

  /**
   * Dates the caller keeps.
   */
  readonly value?: DateValue[] | undefined;
}

/**
 * Returns the zone to format in: `timeZone`, else the zone of the first date the options give.
 *
 * @param options - The dates and the zone.
 * @returns The zone, or nothing for the machine's UTC.
 */
export function zoneOf(options: Zoned): string | undefined {
  const date =
    options.value?.[0] ??
    options.defaultValue?.[0] ??
    options.placeholderValue ??
    options.defaultPlaceholderValue;

  if (options.timeZone !== undefined || date === undefined) return options.timeZone;

  return "timeZone" in date ? date.timeZone : undefined;
}
