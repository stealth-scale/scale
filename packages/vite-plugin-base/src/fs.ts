/**
 * Writes generated files without waking the watcher that watches them, and refuses to delete what
 * it could not compare.
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
 * Reports whether the file system refused because the path does not exist.
 */
function absent(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

/**
 * Reads a file, or nothing where there is none.
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
 *   An identical write is skipped, which keeps a watcher from chasing the plugin's own output round
 *   a loop. The content goes to a hidden file beside the target first and is renamed into place, so
 *   a reader that opens the file during the write reads the old content or the new and never a
 *   part of either. A file that does not exist yet is written, and the directories above it are
 *   created.
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
 * Deletes a directory and everything under it, so a generator starts from nothing.
 *
 * @remarks
 *   A directory that is absent is left absent rather than reported, so the first generation and
 *   every later one run the same code.
 */
export function emptyDir(at: string): void {
  rmSync(at, { force: true, recursive: true });
}

/**
 * Lists every entry under a directory, and nothing where the directory is absent.
 *
 * @throws {@link Error} When the directory exists and cannot be listed. A directory that cannot be
 *   read is not an empty one, and a sync that read it as empty would delete every file it was meant
 *   to keep.
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
 * Lists every file under a directory as a path relative to it, and nothing where the directory is
 * absent.
 */
function filesUnder(at: string): readonly string[] {
  return entriesUnder(at)
    .filter((entry) => entry.isFile())
    .map((entry) => relative(at, join(entry.parentPath, entry.name)));
}

/**
 * Lists every directory under a directory as an absolute path, the deepest first, and nothing
 * where the directory is absent.
 *
 * @remarks
 *   A directory's path is longer than its parent's, so sorting by length puts a directory before
 *   the one holding it. Deleting in that order empties a parent before it is looked at.
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
 *   A generator that empties its output and writes everything again touches every file, and a
 *   watcher then reloads every module behind them. Writing through {@link writeIfChanged} and
 *   deleting only what the source no longer holds leaves an unchanged file as it was, so the
 *   watcher sees the files that changed and no others. A directory left empty by a deletion is
 *   deleted with it. The source is listed before anything is written or deleted, and a source that
 *   cannot be listed stops the sync there with the target as it was. A source that is absent is an
 *   empty one, and the target is emptied to match.
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
