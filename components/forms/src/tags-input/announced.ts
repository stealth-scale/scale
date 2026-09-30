/**
 * Writes what a tags input announces after its value or its highlight changes.
 *
 * @remarks
 *   The root turns the machine's own announcements off and announces through the library's live
 *   regions instead. The machine's region does not announce the first highlight, and it removes any
 *   other element with its ID before it speaks. The root announces the tags added or removed, a tag
 *   edited in place, and the tag the highlight moved onto, one message per change.
 */

import { speakable } from "@stealthscale/hooks";

/**
 * Describes the words a tags input announces, each a function of the tags concerned.
 */
export interface Messages {
  /**
   * Announcement after tags are added.
   */
  readonly added: (values: readonly string[]) => string;

  /**
   * Announcement after one tag is edited in place.
   */
  readonly changed: (value: string, previous: string) => string;

  /**
   * Announcement after the highlight moves onto a tag.
   */
  readonly highlighted: (value: string) => string;

  /**
   * Announcement after tags are removed.
   */
  readonly removed: (values: readonly string[]) => string;
}

/**
 * Describes the root's props that replace the default announcements.
 */
export interface Announcements {
  /**
   * Announcement after tags are added. Defaults to `Added Bridge Ledger`, or `Added 3 tags` for
   * more than one.
   */
  readonly addedMessage?: Messages["added"] | undefined;

  /**
   * Announcement after a tag is edited in place. Defaults to `Changed Bridge to Bridge Ledger`.
   */
  readonly changedMessage?: Messages["changed"] | undefined;

  /**
   * Announcement after the highlight moves onto a tag. Defaults to the tag and the key that
   * removes it, `Bridge Ledger. Press Backspace to remove it.`, and names Enter as well when tags
   * are editable.
   */
  readonly highlightedMessage?: Messages["highlighted"] | undefined;

  /**
   * Announcement after tags are removed. Defaults to `Removed Bridge Ledger`, or `Removed 3 tags`
   * for more than one.
   */
  readonly removedMessage?: Messages["removed"] | undefined;
}

/**
 * Returns a verb followed by the one tag concerned, or by the count of tags when there are more.
 */
function counted(verb: string, values: readonly string[]): string {
  return values.length === 1 ? `${verb} ${values.join("")}` : `${verb} ${values.length} tags`;
}

/**
 * Returns the default announcement after tags are added: `Added Bridge Ledger`, or `Added 3 tags`.
 */
export function added(values: readonly string[]): string {
  return counted("Added", values);
}

/**
 * Returns the default announcement after tags are removed: `Removed Bridge Ledger`, or
 * `Removed 3 tags`.
 */
export function removed(values: readonly string[]): string {
  return counted("Removed", values);
}

/**
 * Returns the default announcement after a tag is edited: `Changed Bridge to Bridge Ledger`.
 */
export function changed(value: string, previous: string): string {
  return `Changed ${previous} to ${value}`;
}

/**
 * Returns the default announcement after the highlight moves onto a tag that can be removed.
 */
export function removable(value: string): string {
  return `${value}. Press Backspace to remove it.`;
}

/**
 * Returns the default announcement after the highlight moves onto a tag that can be edited.
 */
export function editable(value: string): string {
  return `${value}. Press Enter to edit it or Backspace to remove it.`;
}

/**
 * Returns the words to announce: each one the caller passes, and the default for the rest.
 *
 * @param announcements - The announcement props of the root.
 * @param editing - Whether tags can be edited, which the default highlight announcement names.
 * @returns The words for every change.
 */
export function messagesOf(announcements: Announcements, editing: boolean): Messages {
  return {
    added: announcements.addedMessage ?? added,
    changed: announcements.changedMessage ?? changed,
    highlighted: announcements.highlightedMessage ?? (editing ? editable : removable),
    removed: announcements.removedMessage ?? removed,
  };
}

/**
 * Returns the values of one list that the other lacks, counting a repeated value once per
 * occurrence.
 *
 * @param values - The list to read.
 * @param others - The list to match each value against.
 * @returns Each value without a match, in the order of `values`.
 */
export function missing(values: readonly string[], others: readonly string[]): string[] {
  const left = [...others];

  return values.filter((value) => {
    const at = left.indexOf(value);

    if (at === -1) return true;

    left.splice(at, 1);

    return false;
  });
}

/**
 * Returns the only value of a list, or nothing for a list of any other length.
 */
function only(values: readonly string[]): string | undefined {
  return values.length === 1 ? values.join("") : undefined;
}

/**
 * Returns the announcement for a change of value.
 *
 * @remarks
 *   One tag gained and one lost is an edit in place. Any other change announces the tags added and
 *   then the tags removed.
 * @param before - The value before the change.
 * @param after - The value after it.
 * @param messages - The words to announce.
 * @returns The announcement, or an empty string when the two values contain the same tags.
 */
export function changeMessage(
  before: readonly string[],
  after: readonly string[],
  messages: Messages,
): string {
  const gained = missing(after, before);
  const lost = missing(before, after);
  const value = only(gained);
  const previous = only(lost);

  if (value !== undefined && previous !== undefined) return messages.changed(value, previous);

  return speakable([
    ...(gained.length > 0 ? [messages.added(gained)] : []),
    ...(lost.length > 0 ? [messages.removed(lost)] : []),
  ]);
}

/**
 * Returns the announcement for a move of the highlight, read from the highlighted tag's
 * `data-value`.
 *
 * @remarks
 *   The tag is found by an attribute selector, because a React ID contains characters an ID
 *   selector does not accept.
 * @param id - ID of the highlighted tag, or null when the highlight leaves the tags.
 * @param messages - The words to announce.
 * @returns The announcement, or an empty string when no tag with that ID is rendered.
 */
export function highlightMessage(id: null | string, messages: Messages): string {
  const value =
    id === null ? undefined : document.querySelector<HTMLElement>(`[id="${id}"]`)?.dataset["value"];

  return value === undefined ? "" : messages.highlighted(value);
}
