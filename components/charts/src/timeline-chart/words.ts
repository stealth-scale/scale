/**
 * Writes a timeline tooltip's words: a heading with the marker's lane and its time, and a row per
 * moment of the marker, five at most and then how many more.
 *
 * @remarks
 *   A marker of one moment heads the tooltip with its time and writes the moment's words as its
 *   row. A cluster heads the tooltip with the range from its first moment to its last and writes
 *   each moment's time beside its words. A card that listed five of forty moments without a word
 *   would read as a cluster of five, so a longer cluster ends with the row `moreLabel` writes. The
 *   lane's name leads the heading while the chart has more than one lane.
 */

import { separatorOf } from "#chart/separator.ts";
import { type TooltipEntry, type TooltipRow } from "#chart/tooltip.tsx";
import { timeOf } from "#events/layout.ts";
import { type MarkerDatum } from "#timeline-chart/markers.ts";
import { type TimelineLane } from "#timeline-chart/types.ts";

/**
 * Number of moments a tooltip lists before it counts the rest.
 */
export const SHOWN = 5;

/**
 * Writes the row that counts the moments a tooltip does not list unless a chart states a writer.
 */
export function moreOf(count: number): string {
  return `${String(count)} more`;
}

/**
 * Describes the writers of a timeline tooltip's words.
 */
export interface TimelineWriters {
  /**
   * Returns a lane's name from its key, or nothing for a chart of one lane.
   */
  readonly lane?: ((key: string) => string) | undefined;

  /**
   * Writes the row that counts the moments the tooltip does not list.
   */
  readonly more: (count: number) => string;

  /**
   * Writes the range from one instant to another.
   */
  readonly range: (from: number, to: number) => string;

  /**
   * Separator between the lane's name and the time, the locale's list separator.
   */
  readonly separator: string;

  /**
   * Writes an instant.
   */
  readonly time: (at: number) => string;
}

/**
 * Describes what a timeline's writers are built from.
 */
export interface WritersOptions {
  /**
   * Lanes in order, each with its name.
   */
  readonly lanes: readonly TimelineLane[];

  /**
   * Locale the times are written in.
   */
  readonly locale: string;

  /**
   * Writes the row that counts the moments the tooltip does not list. `moreOf` unless stated.
   */
  readonly more?: ((count: number) => string) | undefined;

  /**
   * `Intl.DateTimeFormat` options of the times.
   */
  readonly options: Intl.DateTimeFormatOptions;
}

/**
 * Returns the writers of a timeline's words: each lane's name while there are two lanes or more,
 * the times and ranges in the locale, the list separator and the count of the rest.
 *
 * @remarks
 *   A key without a stated name writes the key.
 * @param writers - The lanes, the locale, the writer of the rest and the times' options.
 */
export function writersOf({
  lanes,
  locale,
  more = moreOf,
  options,
}: WritersOptions): TimelineWriters {
  const format = new Intl.DateTimeFormat(locale, options);
  const names = new Map(lanes.map((lane) => [lane.key, lane.label]));

  return {
    lane: lanes.length > 1 ? (key) => names.get(key) ?? key : undefined,
    more,
    range: (from, to) => format.formatRange(from, to),
    separator: separatorOf(locale),
    time: (at) => format.format(at),
  };
}

/**
 * Returns the marker the tooltip's entries were read from, if any.
 */
function markerOf(entries: readonly TooltipEntry[]): MarkerDatum | undefined {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- recharts passes each entry the marker it was rendered from
  return entries[0]?.payload as MarkerDatum | undefined;
}

/**
 * Returns the writer of the tooltip's heading: the lane's name while the chart has lanes, and the
 * marker's time or range.
 *
 * @param writers - The writers of lanes, times and ranges.
 */
export function headingOf(writers: TimelineWriters): (entries: readonly TooltipEntry[]) => string {
  return (entries) => {
    const marker = markerOf(entries);

    if (marker === undefined) return "";

    const { at, last } = marker.cluster;
    const when = at === last ? writers.time(at) : writers.range(at, last);

    return writers.lane === undefined
      ? when
      : `${writers.lane(marker.lane)}${writers.separator}${when}`;
  };
}

/**
 * Returns the writer of the tooltip's rows: each moment's words, with its time in a cluster, five
 * at most and then the count of the rest.
 *
 * @param writers - The writers of times and of the count of the rest.
 */
export function rowsOf(
  writers: Pick<TimelineWriters, "more" | "time">,
): (entries: readonly TooltipEntry[]) => TooltipRow[] {
  return (entries) => {
    const events = markerOf(entries)?.cluster.events ?? [];
    const many = events.length > 1;
    const rows: TooltipRow[] = events.slice(0, SHOWN).map((event) => ({
      key: event.key,
      name: event.label,
      value: many ? writers.time(timeOf(event.at)) : "",
    }));
    const rest = events.length - SHOWN;

    return rest > 0 ? [...rows, { key: "more", name: writers.more(rest), value: "" }] : rows;
  };
}
