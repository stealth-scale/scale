/**
 * Lays daily readings out as a heatmap calendar: a row per weekday, a column per week under its
 * month, and a square per day of the window.
 *
 * @remarks
 *   A day is a civil date written `YYYY-MM-DD`, never an instant, and the layout reads it as a
 *   calendar date, so no time zone moves a day onto its neighbour. A date that does not read as one
 *   is left out. The window runs from `from` to `to`, the days' span unless stated, in whole weeks:
 *   a day outside it is left out, a day inside it without a reading is missing, and a place of a
 *   first or last week outside the window is an empty place of the sparse grid. Of two readings for
 *   one date the later applies. A week belongs to the month of its first day in the window. The
 *   words are `Intl.DateTimeFormat`'s in the locale, and the week starts on the locale's first day
 *   unless `weekStartsOn` states one.
 */

import { type CalendarDate, type DayOfWeek, parseDate, startOfWeek } from "@internationalized/date";

import { type HeatmapCell, type HeatmapHeading } from "#heatmap/cells.ts";

/**
 * Describes one day's reading: its civil date and its value.
 */
export interface CalendarDay {
  /**
   * Civil date of the day, written `YYYY-MM-DD`.
   */
  readonly date: string;

  /**
   * Value, or `null` for a day nobody measured.
   */
  readonly value: null | number;
}

/**
 * Describes a day of the calendar as a heatmap cell, which `onSelect` receives with its date.
 */
export interface CalendarCell extends HeatmapCell {
  /**
   * Civil date of the day, written `YYYY-MM-DD`.
   */
  readonly date: string;
}

/**
 * Describes the window and the words of a calendar.
 */
export interface CalendarOptions {
  /**
   * First day of the window, written `YYYY-MM-DD`. The earliest day unless stated.
   */
  readonly from?: string | undefined;

  /**
   * Locale of the weekday and month words and of each day's date, and of the week's first day.
   */
  readonly locale: string;

  /**
   * Last day of the window, written `YYYY-MM-DD`. The latest day unless stated.
   */
  readonly to?: string | undefined;

  /**
   * Day each week starts on. The locale's first day of the week unless stated.
   */
  readonly weekStartsOn?: DayOfWeek | undefined;
}

/**
 * Describes the heatmap props of a calendar: its days, its weeks, its months, its weekdays, and
 * square cells in a sparse grid.
 */
export interface Calendar {
  /**
   * Days of the window, each with its date as its label.
   */
  readonly cells: readonly CalendarCell[];

  /**
   * Weeks, each keyed by its first date, with a hidden heading of its dates in the window.
   */
  readonly columns: readonly HeatmapHeading[];

  /**
   * Months the weeks belong to, the first with its year.
   */
  readonly groups: readonly HeatmapHeading[];

  /**
   * Weekdays from the week's first day, each keyed by its `DayOfWeek`.
   */
  readonly rows: readonly HeatmapHeading[];

  /**
   * Shape of the cells, a square per day.
   */
  readonly shape: "square";

  /**
   * Whether a place outside the window is empty, which it is.
   */
  readonly sparse: true;
}

/**
 * Describes a week's column, which always names the month it belongs to.
 */
interface Week extends HeatmapHeading {
  /**
   * Key of the month of the week's first day in the window, written `YYYY-MM`.
   */
  readonly group: string;
}

/**
 * Lists the days of the week in the order `Date.prototype.getUTCDay` counts them.
 */
const WEEKDAYS: readonly DayOfWeek[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * Options of the words of a week's dates, such as "Mar 1 – 7, 2026" in English.
 */
const RANGE: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };

/**
 * Returns the date a civil date string writes, or undefined for a string that writes none.
 */
function dateOf(text: string): CalendarDate | undefined {
  try {
    return parseDate(text);
  } catch {
    return undefined;
  }
}

/**
 * Returns every date from one date to another, both included, stepping by a number of days.
 */
function datesOf(from: CalendarDate, to: CalendarDate, step: number): readonly CalendarDate[] {
  const dates: CalendarDate[] = [];

  for (let at = from; at.compare(to) <= 0; at = at.add({ days: step })) dates.push(at);

  return dates;
}

/**
 * Returns the later of two dates.
 */
function later(one: CalendarDate, other: CalendarDate): CalendarDate {
  return one.compare(other) < 0 ? other : one;
}

/**
 * Returns the earlier of two dates.
 */
function earlier(one: CalendarDate, other: CalendarDate): CalendarDate {
  return one.compare(other) > 0 ? other : one;
}

/**
 * Returns the key of a date's month, written `YYYY-MM`.
 */
function monthOf(date: CalendarDate): string {
  return date.toString().slice(0, 7);
}

/**
 * Returns the key of a date's weekday.
 */
function weekdayOf(date: CalendarDate): DayOfWeek {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- getUTCDay counts the seven days WEEKDAYS lists
  return WEEKDAYS[date.toDate("UTC").getUTCDay()] as DayOfWeek;
}

/**
 * Returns a writer of dates in the locale, which reads each date at midnight UTC so no zone moves
 * it.
 */
function writer(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): (date: CalendarDate) => string {
  const format = new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" });

  return (date) => format.format(date.toDate("UTC"));
}

/**
 * Returns the earliest and the latest of some dates, or undefined without a date.
 */
function spanOf(dates: readonly CalendarDate[]): [CalendarDate, CalendarDate] | undefined {
  const [first, ...rest] = dates;

  return first === undefined
    ? undefined
    : [
        rest.reduce((one, other) => earlier(one, other), first),
        rest.reduce((one, other) => later(one, other), first),
      ];
}

/**
 * Returns the window's first and last day, the stated ends else the days' span, or undefined
 * without a window.
 */
function windowOf(
  dates: readonly CalendarDate[],
  options: CalendarOptions,
): [CalendarDate, CalendarDate] | undefined {
  const span = spanOf(dates);
  const from = options.from === undefined ? span?.[0] : dateOf(options.from);
  const to = options.to === undefined ? span?.[1] : dateOf(options.to);

  return from === undefined || to === undefined || from.compare(to) > 0 ? undefined : [from, to];
}

/**
 * Returns the weeks of the window, each keyed by its first date, grouped by the month of its first
 * day in the window, with a hidden heading of its dates in the window.
 */
function columnsOf(
  origin: CalendarDate,
  [from, to]: [CalendarDate, CalendarDate],
  locale: string,
): readonly Week[] {
  const range = new Intl.DateTimeFormat(locale, { ...RANGE, timeZone: "UTC" });

  return datesOf(origin, to, 7).map((week) => {
    const start = later(week, from);
    const end = earlier(week.add({ days: 6 }), to);

    return {
      group: monthOf(start),
      hidden: true,
      key: week.toString(),
      label: range.formatRange(start.toDate("UTC"), end.toDate("UTC")),
    };
  });
}

/**
 * Returns the months the weeks belong to, in order, each with its short name, and the first with
 * its year.
 *
 * @remarks
 *   Only the first month writes its year, because a month's words hide while they are wider than
 *   its weeks, and "Jan 2026" is wider than four weeks of the smallest squares.
 */
function groupsOf(columns: readonly Week[], locale: string): readonly HeatmapHeading[] {
  const month = writer(locale, { month: "short" });
  const dated = writer(locale, { month: "short", year: "numeric" });
  const keys = [...new Set(columns.map((column) => column.group))];

  return keys.map((key, at) => {
    const first = parseDate(`${key}-01`);

    return { key, label: at === 0 ? dated(first) : month(first) };
  });
}

/**
 * Returns the heatmap props of a calendar of daily readings: a square per day of the window, a row
 * per weekday, a hidden heading per week and a group per month.
 *
 * @param days - The readings, one per civil date, in any order.
 * @param options - The window, the locale and the week's first day.
 * @returns The props to spread into `Heatmap`, without cells, weeks or weekdays without a window.
 */
export function calendarCells(days: readonly CalendarDay[], options: CalendarOptions): Calendar {
  const read = days.flatMap(({ date, value }) => {
    const parsed = dateOf(date);

    return parsed === undefined ? [] : [{ date: parsed, value }];
  });
  const window = windowOf(
    read.map(({ date }) => date),
    options,
  );

  if (window === undefined) {
    return { cells: [], columns: [], groups: [], rows: [], shape: "square", sparse: true };
  }

  const [from, to] = window;
  const origin = startOfWeek(from, options.locale, options.weekStartsOn);
  const values = new Map(read.map(({ date, value }) => [date.toString(), value]));
  const columns = columnsOf(origin, window, options.locale);
  const weekday = writer(options.locale, { weekday: "short" });
  const full = writer(options.locale, { dateStyle: "full" });

  return {
    cells: datesOf(from, to, 1).map((date) => ({
      column: startOfWeek(date, options.locale, options.weekStartsOn).toString(),
      date: date.toString(),
      label: full(date),
      row: weekdayOf(date),
      value: values.get(date.toString()) ?? null,
    })),
    columns,
    groups: groupsOf(columns, options.locale),
    rows: datesOf(origin, origin.add({ days: 6 }), 1).map((date) => ({
      key: weekdayOf(date),
      label: weekday(date),
    })),
    shape: "square",
    sparse: true,
  };
}
