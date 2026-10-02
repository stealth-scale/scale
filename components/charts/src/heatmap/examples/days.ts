/**
 * Lists the daily readings of the heatmap's calendar scenes: a year of deploys with a fortnight the
 * collector did not record, a quarter of on-call pages, and a quarter of hotel rooms booked per
 * night.
 */

import { type CalendarDay } from "#heatmap/index.ts";

/**
 * Milliseconds in a day.
 */
const DAY = 86_400_000;

/**
 * Returns a reading per day from a civil date on, each valued from its weekday, 0 being Sunday,
 * its place in the run and its date.
 *
 * @param from - The first day, written `YYYY-MM-DD`.
 * @param count - The number of days.
 * @param value - Returns a day's value from its weekday, its place and its date.
 */
export function daysOf(
  from: string,
  count: number,
  value: (weekday: number, at: number, date: string) => null | number,
): readonly CalendarDay[] {
  const start = Date.parse(`${from}T00:00:00Z`);

  return Array.from({ length: count }, (_, at) => {
    const day = new Date(start + at * DAY);
    const date = day.toISOString().slice(0, 10);

    return { date, value: value(day.getUTCDay(), at, date) };
  });
}

/**
 * Returns whether a weekday, 0 being Sunday, is on a weekend.
 */
function weekend(weekday: number): boolean {
  return weekday === 0 || weekday === 6;
}

/**
 * Lists a year of deploys per day from 1 October 2025: none at weekends, one a day over the
 * holidays, a release push in the week of 9 March, and no record from 9 to 22 February, when the
 * collector was offline. The release week is the busiest, with 80 deploys.
 */
export const DEPLOYS: readonly CalendarDay[] = daysOf("2025-10-01", 365, (weekday, at, date) => {
  if (date >= "2026-02-09" && date <= "2026-02-22") return null;
  if (weekend(weekday)) return 0;
  if (date >= "2025-12-22" && date <= "2026-01-02") return 1;

  return 3 + ((at * 7) % 11) + (date >= "2026-03-09" && date <= "2026-03-13" ? 8 : 0);
});

/**
 * Lists 13 weeks of on-call pages per day from Monday 5 January 2026: one to six on a working day,
 * up to two at a weekend, and 14 during the incident on Tuesday 17 February.
 */
export const PAGES: readonly CalendarDay[] = daysOf("2026-01-05", 91, (weekday, at, date) => {
  if (date === "2026-02-17") return 14;

  return weekend(weekday) ? at % 3 : 1 + ((at * 5) % 6);
});

/**
 * Lists a quarter of hotel rooms booked per night from 1 April 2026, of 84: 30 to 54 on a
 * weeknight, 70 to 82 on a Friday or a Saturday, and all 84 over the conference from 12 to 14 May.
 */
export const BOOKINGS: readonly CalendarDay[] = daysOf("2026-04-01", 91, (weekday, at, date) => {
  if (date >= "2026-05-12" && date <= "2026-05-14") return 84;

  return weekday === 5 || weekday === 6 ? 70 + ((at * 3) % 13) : 30 + ((at * 7) % 25);
});
