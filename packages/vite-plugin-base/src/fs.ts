/**
 * Writes generated files without waking the watcher on content that did not change.
 *
 * @remarks
 *   A write whose content matches what is already on disk is skipped, so the file watcher does not
 *   reload a module the plugin regenerated identically. A directory that cannot be listed aborts a
 *   sync instead of being treated as empty.
 */

import {
  type Dirent,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative } from "node:path";

/**
 * Reports whether an error is the filesystem's `ENOENT`.
 */
function absent(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

/**
 * Reads a file, returning undefined when it does not exist.
 *
 * @throws {@link Error} When the file exists and cannot be read.
 */
function current(at: string): string | undefined {
  try {
    return readFileSync(at, "utf8");
  } catch (error: unknown) {
    if (absent(error)) return undefined;

    throw error;
  }
}

/**
 * Writes a file when its content differs from what is on disk, and reports whether it wrote.
 *
 * @remarks
 *   An identical write is skipped, so the file watcher does not fire on the plugin's own output.
 *   Content goes to a temporary file in the same directory and is renamed into place, so a
 *   concurrent reader gets either the old content or the new one, never a partial write. The
 *   directories above the target are created.
 * @returns True when the file was written.
 * @throws {@link Error} When the file exists and cannot be read, or the directory cannot be
 *   written.
 */
export function writeIfChanged(at: string, content: string): boolean {
  if (current(at) === content) return false;

  const staged = join(dirname(at), `.${basename(at)}.${String(process.pid)}.tmp`);

  mkdirSync(dirname(at), { recursive: true });
  writeFileSync(staged, content, "utf8");
  renameSync(staged, at);

  return true;
}

/**
 * Deletes a directory and everything under it.
 *
 * @remarks
 *   An absent directory is not an error, so the first generation and every later one follow the
 *   same path.
 */
export function emptyDir(at: string): void {
  rmSync(at, { force: true, recursive: true });
}

/**
 * Lists every entry under a directory, or an empty array when the directory is absent.
 *
 * @throws {@link Error} When the directory exists and cannot be listed. An unreadable directory is
 *   not an empty one, and a sync that treated it as empty would delete every file it was meant to
 *   keep.
 */
function entriesUnder(at: string): readonly Dirent[] {
  try {
    return readdirSync(at, { recursive: true, withFileTypes: true });
  } catch (error: unknown) {
    if (absent(error)) return [];

    throw error;
  }
}

/**
 * Lists every file under a directory, as paths relative to it, or an empty array when the directory
 * is absent.
 */
function filesUnder(at: string): readonly string[] {
  return entriesUnder(at)
    .filter((entry) => entry.isFile())
    .map((entry) => relative(at, join(entry.parentPath, entry.name)));
}

/**
 * Lists the directories under a directory as absolute paths, deepest first, or an empty array when
 * the directory is absent.
 *
 * @remarks
 *   A directory's path is longer than its parent's, so sorting by descending length puts a child
 *   before its parent. Deleting in that order empties a parent before the parent is examined.
 */
function directoriesUnder(at: string): readonly string[] {
  return entriesUnder(at)
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(entry.parentPath, entry.name))
    .toSorted((one, other) => other.length - one.length);
}

/**
 * Makes one directory hold exactly the files of another, writing only what differs.
 *
 * @remarks
 *   Emptying the target and rewriting it would touch every file, and the watcher would reload every
 *   module behind them. Only files whose content changed are written, and only files the source no
 *   longer holds are deleted, so the watcher sees the changes and nothing else. A directory left
 *   empty by a deletion is removed as well. The source is listed before anything is written, so a
 *   source that cannot be listed aborts with the target unchanged, and an absent source empties the
 *   target.
 * @throws {@link Error} When either directory exists and cannot be listed, or a file cannot be
 *   written.
 */
export function syncDir(from: string, to: string): void {
  const wanted = new Set(filesUnder(from));
  const held = filesUnder(to);

  for (const file of wanted) writeIfChanged(join(to, file), readFileSync(join(from, file), "utf8"));

  for (const file of held) {
    if (!wanted.has(file)) rmSync(join(to, file), { force: true });
  }

  for (const directory of directoriesUnder(to)) {
    if (readdirSync(directory).length === 0) rmSync(directory, { recursive: true });
  }
}
