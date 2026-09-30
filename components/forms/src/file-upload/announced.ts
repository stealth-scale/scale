/**
 * Writes what a file upload announces after it adds, removes or refuses files.
 *
 * @remarks
 *   The file picker returns focus to the control that opened it, and a drop leaves focus where it
 *   was, so a screen reader hears nothing of a change to the list unless the upload announces it.
 *   The root announces the files added and removed in one message, and the files refused in
 *   another.
 */

import { type FileRejection } from "@zag-js/file-upload";

import { speakable } from "@stealthscale/hooks";

/**
 * Describes the words a file upload announces, each a function of the files concerned.
 */
export interface Messages {
  /**
   * Announcement after files are added.
   */
  readonly added: (files: readonly File[]) => string;

  /**
   * Announcement after files are refused.
   */
  readonly rejected: (rejections: readonly FileRejection[]) => string;

  /**
   * Announcement after files are removed.
   */
  readonly removed: (files: readonly File[]) => string;
}

/**
 * Describes the root's props that replace the default announcements.
 */
export interface Announcements {
  /**
   * Announcement after files are added. Defaults to `Added statement.pdf`, or `Added 3 files` for
   * more than one.
   */
  readonly addedMessage?: Messages["added"] | undefined;

  /**
   * Announcement after files are refused. Defaults to `Could not add statement.heic`, or
   * `Could not add 3 files` for more than one.
   */
  readonly rejectedMessage?: Messages["rejected"] | undefined;

  /**
   * Announcement after files are removed. Defaults to `Removed statement.pdf`, or
   * `Removed 3 files` for more than one.
   */
  readonly removedMessage?: Messages["removed"] | undefined;
}

/**
 * Returns a verb followed by the one file's name, or by the count of files when there are more.
 */
function counted(verb: string, files: readonly File[]): string {
  return files.length === 1
    ? `${verb} ${files.map((file) => file.name).join("")}`
    : `${verb} ${String(files.length)} files`;
}

/**
 * Returns the default announcement after files are added: `Added statement.pdf`, or
 * `Added 3 files`.
 */
export function added(files: readonly File[]): string {
  return counted("Added", files);
}

/**
 * Returns the default announcement after files are removed: `Removed statement.pdf`, or
 * `Removed 3 files`.
 */
export function removed(files: readonly File[]): string {
  return counted("Removed", files);
}

/**
 * Returns the default announcement after files are refused: `Could not add statement.heic`, or
 * `Could not add 3 files`.
 */
export function rejected(rejections: readonly FileRejection[]): string {
  return counted(
    "Could not add",
    rejections.map((rejection) => rejection.file),
  );
}

/**
 * Returns the words to announce: each one the caller passes, and the default for the rest.
 *
 * @param announcements - The announcement props of the root.
 * @returns The words for every change.
 */
export function messagesOf(announcements: Announcements): Messages {
  return {
    added: announcements.addedMessage ?? added,
    rejected: announcements.rejectedMessage ?? rejected,
    removed: announcements.removedMessage ?? removed,
  };
}

/**
 * Returns the announcement for a change of the accepted files: the files added, then the files
 * removed.
 *
 * @param before - The accepted files before the change.
 * @param after - The accepted files after it.
 * @param messages - The words to announce.
 * @returns The announcement, or an empty string when both lists contain the same files.
 */
export function acceptMessage(
  before: readonly File[],
  after: readonly File[],
  messages: Messages,
): string {
  const gained = after.filter((file) => !before.includes(file));
  const lost = before.filter((file) => !after.includes(file));

  return speakable([
    ...(gained.length > 0 ? [messages.added(gained)] : []),
    ...(lost.length > 0 ? [messages.removed(lost)] : []),
  ]);
}

/**
 * Returns the announcement for a change of the refused files.
 *
 * @param rejections - The files the upload refused, with the reasons.
 * @param messages - The words to announce.
 * @returns The announcement, or an empty string when the list was cleared.
 */
export function rejectMessage(rejections: readonly FileRejection[], messages: Messages): string {
  return rejections.length > 0 ? messages.rejected(rejections) : "";
}
