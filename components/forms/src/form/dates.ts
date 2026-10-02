/**
 * Converts between a form's ISO 8601 date value and the dates a date input edits.
 */

import { type DateValue, parseDate } from "@internationalized/date";

/**
 * Matches an ISO 8601 calendar date, `2026-10-01`.
 */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;

/**
 * Reads the dates a date input shows for a field's value: the one date it names, or none for a
 * value that names no date of the calendar.
 *
 * @param value - The field's value, an ISO 8601 date where the field has one.
 * @returns The date, as a list of one, or an empty list.
 */
export function datesOf(value?: unknown): DateValue[] {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return [];

  try {
    return [parseDate(value)];
  } catch {
    return [];
  }
}
