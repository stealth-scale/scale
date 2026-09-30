/**
 * Returns the names of the date input's groups and segments, and the names its dates submit under.
 *
 * @remarks
 *   A segment's name is its type in the input's locale, from the browser's `Intl.DisplayNames`,
 *   such as "year", "Jahr" or "年", followed by the group's name. React Aria's date field names its
 *   segments the same way, because VoiceOver on iOS does not announce the group a segment is in.
 */

import { type DateSegment } from "#date-input/machine.ts";

/**
 * Describes the naming attributes of a segment.
 */
export interface SegmentLabelling {
  /**
   * Name of the segment's type in the locale, followed by the group's own name where the group has
   * one.
   */
  readonly "aria-label": string;

  /**
   * The segment's ID and the label's, so the name reads the segment's words, then the label.
   */
  readonly "aria-labelledby"?: string | undefined;
}

/**
 * Returns the name of a segment type in a locale.
 *
 * @param type - The segment's type, such as `year` or `dayPeriod`.
 * @param locale - The locale the name is written in.
 * @returns The name, or the type itself where the browser has no name for it.
 */
export function segmentName(type: DateSegment["type"], locale: string): string {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the default fallback returns the code itself for a field the browser has no name for
  return new Intl.DisplayNames([locale], { type: "dateTimeField" }).of(type) as string;
}

/**
 * Returns the name a form submits one date under: `name`, or `name[0]` and `name[1]` for a range.
 *
 * @remarks
 *   The machine indexes the names only while two dates are set, so a range with one date submits
 *   both inputs under one name. This name follows the selection mode.
 * @param name - The root's `name`, or nothing for an input that submits nothing.
 * @param range - Whether the input edits a range of two dates.
 * @param index - Index of the date: 0 for the start, 1 for the end.
 * @returns The name, or nothing without `name`.
 */
export function submittedName(
  name: string | undefined,
  range: boolean,
  index: number,
): string | undefined {
  if (name === undefined) return undefined;

  return range ? `${name}[${index}]` : name;
}

/**
 * Returns the IDs a group is named by: the label's, and the group's own where it has an
 * `aria-label` too.
 *
 * @param label - ID of the label that names the input, or nothing without one.
 * @param own - The group's own `aria-label`, or nothing.
 * @param group - ID of the group.
 * @returns The value of `aria-labelledby`, or nothing without a label.
 */
export function groupLabelledBy(
  label: string | undefined,
  own: string | undefined,
  group: string,
): string | undefined {
  if (label === undefined) return undefined;

  return own === undefined ? label : `${label} ${group}`;
}

/**
 * Returns the naming attributes of a segment: its name and the group's own name, then the label.
 *
 * @param name - The segment's name in the locale.
 * @param id - ID of the segment element, the first reference of its `aria-labelledby`.
 * @param label - ID of the label that names the input, or nothing without one.
 * @param group - The group's own `aria-label`, or nothing.
 * @returns The segment's `aria-label`, and its `aria-labelledby` while a label names the input.
 */
export function segmentLabelling(
  name: string,
  id: string,
  label?: string,
  group?: string,
): SegmentLabelling {
  const own = group === undefined ? name : `${name}, ${group}`;

  if (label === undefined) return { "aria-label": own };

  return { "aria-label": `${own},`, "aria-labelledby": `${id} ${label}` };
}
