/**
 * Writes a timer's time as English words, the default name of the timer's area.
 *
 * @remarks
 *   The `timer` role takes its name from the author and not from its content, so the area needs a
 *   name, and the figures read as a string of digits. The words list the days, hours and minutes
 *   that are not zero and always the seconds, so a finished countdown reads "0 seconds". A page in
 *   another language passes its own `label` to the area.
 */

import { type Time } from "@zag-js/timer";

/**
 * Lists the units the words name, largest first.
 */
const UNITS = ["days", "hours", "minutes", "seconds"] as const;

/**
 * Maps each unit to its singular word.
 */
const SINGULAR = { days: "day", hours: "hour", minutes: "minute", seconds: "second" };

/**
 * Returns a time as English words without its milliseconds, such as "2 minutes, 5 seconds".
 */
export function spoken(time: Time): string {
  return UNITS.filter((unit) => unit === "seconds" || time[unit] > 0)
    .map((unit) => `${String(time[unit])} ${time[unit] === 1 ? SINGULAR[unit] : unit}`)
    .join(", ");
}
