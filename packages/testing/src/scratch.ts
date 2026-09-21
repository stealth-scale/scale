/**
 * Creates a throwaway directory tree under the system temporary directory for one specification.
 *
 * @remarks
 *   A specification owns its tree outright, so it can assert an exact file count and exact names.
 *   Every relative path is resolved against the root before use, and one that escapes the root
 *   throws rather than reaching the rest of the filesystem.
 */

import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";

/**
 * File contents keyed by path relative to the workspace root.
 *
 * @remarks
 *   A path separator in a key creates the directories above the file. An empty string is content
 *   like any other and writes an empty file.
 */
export type ScratchFiles = Readonly<Record<string, string>>;

/**
 * Lists the files below a directory, as paths relative to where the walk began.
 *
 * @remarks
 *   A directory contributes its contents and no entry for itself, so an empty directory does not
 *   appear in the listing. A symbolic link is listed as a file whatever it points at.
 */
function walk(directory: string, prefix: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(join(directory, entry.name), `${prefix}${entry.name}/`)
      : [`${prefix}${entry.name}`],
  );
}

/**
 * A temporary directory one specification writes to for the length of one test.
 *
 * @remarks
 *   Nothing deletes the directory automatically. A specification that constructs an instance
 *   directly calls {@link ScratchWorkspace.remove} itself. {@link withScratchWorkspace} calls it
 *   for one that does not.
 */
export class ScratchWorkspace {
  /**
   * Absolute path of the workspace directory.
   */
  readonly root: string;

  /**
   * Adopts a directory that already exists.
   *
   * @remarks
   *   The directory is neither created nor emptied here, and whatever is already in it stays.
   *   {@link scratchWorkspace} returns a fresh one instead.
   * @param root - An absolute path. A relative one resolves every path inside the workspace
   *   somewhere else, and {@link ScratchWorkspace.path} then rejects all of them.
   */
  constructor(root: string) {
    this.root = root;
  }

  /**
   * Lists every file in the workspace, sorted by path.
   *
   * @remarks
   *   The tree is walked on each call, so the listing reflects a write made a moment earlier. A
   *   directory holding no files does not appear.
   * @returns Each path relative to the root, separated by `/`.
   */
  files(): string[] {
    return walk(this.root, "").toSorted();
  }

  /**
   * Resolves a relative path against the root and rejects one that leaves the workspace.
   *
   * @remarks
   *   The check runs on the resolved string, so `..` segments that cancel each other out are
   *   accepted. Symbolic links are not followed, so one inside the workspace passes whatever it
   *   points at.
   * @returns The absolute path, which for `.` is the root itself.
   * @throws {@link Error} When the path resolves outside the root.
   */
  path(relative: string): string {
    const target = resolve(this.root, relative);
    if (target !== this.root && !target.startsWith(this.root + sep)) {
      throw new Error(`${relative} leaves the scratch workspace`);
    }
    return target;
  }

  /**
   * Reads a file in the workspace as UTF-8 text.
   *
   * @throws {@link Error} With the code `ENOENT` when the file is absent, and with no code at all
   *   when the path leaves the workspace.
   */
  read(relative: string): string {
    return readFileSync(this.path(relative), "utf8");
  }

  /**
   * Deletes the workspace directory and everything below it.
   *
   * @remarks
   *   A second call is a no-op, so removing the workspace in the body and again in a teardown is
   *   safe. The instance stays usable and every read after this throws.
   */
  remove(): void {
    rmSync(this.root, { force: true, recursive: true });
  }

  /**
   * Writes each file into the workspace, creating the directories above it.
   *
   * @remarks
   *   An existing file is overwritten and no other file is touched, so a second call adds to the
   *   tree. Entries are written in the order the object lists them, and one that leaves the
   *   workspace throws with the earlier entries already on disk.
   */
  write(files: ScratchFiles): void {
    for (const [relative, content] of Object.entries(files)) {
      const target = this.path(relative);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
  }
}

/**
 * Creates a workspace under the system temporary directory and writes the files into it.
 *
 * @remarks
 *   Two calls cannot collide, because the operating system supplies the last part of the directory
 *   name. Nothing schedules cleanup, so a caller that never reaches
 *   {@link ScratchWorkspace.remove} leaves the tree behind until the machine clears its temporary
 *   directory.
 */
export function scratchWorkspace(files: ScratchFiles = {}): ScratchWorkspace {
  const workspace = new ScratchWorkspace(mkdtempSync(join(tmpdir(), "stealth-")));
  workspace.write(files);
  return workspace;
}

/**
 * Runs a function against a fresh workspace and deletes the directory once it returns.
 *
 * @remarks
 *   The directory is deleted whether the function returns or throws, and the error reaches the
 *   caller unchanged. A function returning a promise is not awaited and loses its directory while
 *   it is still running. Use {@link withScratchWorkspaceAsync} for that case.
 * @returns The value the function produced.
 * @throws {@link Error} Any error the function threw, raised after the directory is deleted.
 */
export function withScratchWorkspace<Result>(
  files: ScratchFiles,
  run: (workspace: ScratchWorkspace) => Result,
): Result {
  const workspace = scratchWorkspace(files);
  try {
    return run(workspace);
  } finally {
    workspace.remove();
  }
}

/**
 * Awaits a function against a fresh workspace and deletes the directory once it settles.
 *
 * @remarks
 *   The directory survives until the function's promise settles, so the function can read and write
 *   across any number of awaits. Work the function starts but does not await loses the directory
 *   while it is still running.
 * @returns The value the function resolved to.
 * @throws {@link Error} Any error the function rejected with, raised after the directory is
 *   deleted.
 */
export async function withScratchWorkspaceAsync<Result>(
  files: ScratchFiles,
  run: (workspace: ScratchWorkspace) => Promise<Result>,
): Promise<Result> {
  const workspace = scratchWorkspace(files);
  try {
    return await run(workspace);
  } finally {
    workspace.remove();
  }
}
