/**
 * Serialises work on a path across processes, using a directory as the lock.
 *
 * @remarks
 *   A type check and a dev server in one checkout generate the same paths, and one reads a file the
 *   other is part-way through writing. Creating a directory is atomic on every file system, which
 *   is why the lock is one. The holder's process id goes in a file inside it, so a lock left behind
 *   by a process that died is taken over rather than waited out.
 */

import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

/**
 * Sets the name of the file inside the lock directory that records the holder.
 */
const OWNER = "owner.json";

/**
 * Sets the pause between two attempts on the lock, in milliseconds.
 */
const POLL = 25;

/**
 * Sets the default limit on waiting for a live owner, in milliseconds.
 */
const WAIT = 30_000;

/**
 * Sets how long a lock may stand with no owner file before a waiter treats it as abandoned, in
 * milliseconds.
 *
 * @remarks
 *   Taking the lock is two operations, the directory and then the owner file inside it. A process
 *   that dies between them leaves a lock nothing releases. One second covers the gap a live process
 *   leaves between the two.
 */
const GRACE = 1000;

/**
 * Bounds how long {@link withLock} waits for a lock another process holds.
 */
export interface Locking {
  /**
   * Sets how long the lock may stand with no owner recorded before a waiter takes it over, in
   * milliseconds. One second where absent.
   */
  grace?: number | undefined;

  /**
   * Limits the wait on a live owner, in milliseconds. Thirty seconds where absent.
   */
  wait?: number | undefined;
}

/**
 * Repeats {@link Locking} with the defaults filled in.
 */
interface Limits {
  /**
   * Sets how long the lock may stand with no owner recorded before a waiter takes it over, in
   * milliseconds.
   */
  grace: number;

  /**
   * Limits the wait on a live owner, in milliseconds.
   */
  wait: number;
}

/**
 * Records the process holding a lock and when it took it.
 */
interface Owner {
  /**
   * Gives the process id of the holder.
   */
  pid: number;

  /**
   * Gives the time that process took the lock, as an ISO 8601 string.
   */
  since: string;
}

/**
 * Returns the `code` property a thrown value carries, or undefined where it carries none.
 *
 * @remarks
 *   A thrown value need not be an Error. Boxing it before the read means a thrown string, or a
 *   thrown undefined, yields no code instead of throwing again.
 */
function codeOf(error: unknown): string | undefined {
  const code: unknown = Reflect.get(new Object(error), "code");

  return typeof code === "string" ? code : undefined;
}

/**
 * Returns true when a parsed owner file carries the pid and timestamp {@link taken} writes, and
 * narrows it to {@link Owner}.
 */
function isOwner(held: unknown): held is Owner {
  return (
    typeof held === "object" &&
    held !== null &&
    "pid" in held &&
    typeof held.pid === "number" &&
    "since" in held &&
    typeof held.since === "string"
  );
}

/**
 * Reads the owner recorded in a lock directory, and returns undefined where the file is absent,
 * unreadable or not an owner record.
 */
function ownerOf(at: string): Owner | undefined {
  try {
    const held: unknown = JSON.parse(readFileSync(join(at, OWNER), "utf8"));

    return isOwner(held) ? held : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Returns true when a process with this id is still running.
 *
 * @remarks
 *   Signal zero tests for the process without delivering a signal. Only ESRCH means the process is
 *   gone: one owned by another user fails the test with EPERM and is running.
 */
function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);

    return true;
  } catch (error: unknown) {
    return codeOf(error) !== "ESRCH";
  }
}

/**
 * Takes the lock and records this process as the holder, and returns false where another process
 * holds it already.
 *
 * @throws {@link Error} When the directory cannot be created for any reason but EEXIST.
 */
function taken(at: string): boolean {
  try {
    mkdirSync(at);
  } catch (error: unknown) {
    if (codeOf(error) === "EEXIST") return false;

    throw error;
  }

  writeFileSync(
    join(at, OWNER),
    JSON.stringify({ pid: process.pid, since: new Date().toISOString() }),
  );

  return true;
}

/**
 * Removes a lock whose holder abandoned it.
 *
 * @remarks
 *   The lock is renamed before it is removed, because a rename succeeds for one process alone. Two
 *   waiters that both found the holder dead would otherwise both remove the lock, and the second
 *   removal could take away a lock a third process had taken in between.
 * @throws {@link Error} When the lock cannot be renamed for any reason but ENOENT.
 */
function reclaimed(at: string): void {
  const aside = `${at}.abandoned.${String(process.pid)}`;

  try {
    renameSync(at, aside);
  } catch (error: unknown) {
    if (codeOf(error) === "ENOENT") return;

    throw error;
  }

  rmSync(aside, { force: true, recursive: true });
}

/**
 * Carries what one waiter has seen of a lock from one attempt to the next.
 */
interface Waiting {
  /**
   * Gives the time the wait began, as a millisecond timestamp.
   */
  started: number;

  /**
   * Gives the time the lock was first seen with no owner file, and stays undefined while an owner
   * is recorded.
   */
  unowned?: number | undefined;
}

/**
 * Clears a lock the waiter found abandoned, and otherwise leaves it for another attempt.
 *
 * @returns The state of the wait, for the next attempt.
 * @throws {@link Error} When a live owner has held the lock for longer than the wait allows. The
 *   message gives its pid and when it took the lock.
 */
function considered(at: string, seen: Waiting, limits: Limits): Waiting {
  const owner = ownerOf(at);
  const now = Date.now();
  const unowned = owner === undefined ? (seen.unowned ?? now) : undefined;

  if (unowned !== undefined && now - unowned >= limits.grace) {
    reclaimed(at);
  } else if (owner !== undefined && !alive(owner.pid)) {
    reclaimed(at);
  } else if (owner !== undefined && now - seen.started >= limits.wait) {
    throw new Error(
      `${at} is held by process ${String(owner.pid)} since ${owner.since}, and ` +
        `${String(limits.wait)} ms passed waiting for it`,
    );
  }

  return { started: seen.started, unowned };
}

/**
 * Tries the lock, and retries after a pause for as long as another process holds it.
 */
async function waited(at: string, limits: Limits, seen: Waiting): Promise<void> {
  if (taken(at)) return;

  const next = considered(at, seen, limits);

  await sleep(POLL);

  return waited(at, limits, next);
}

/**
 * Resolves once this process holds the lock.
 *
 * @throws {@link Error} When a live owner holds the lock for longer than the wait allows.
 */
function acquired(at: string, limits: Limits): Promise<void> {
  return waited(at, limits, { started: Date.now() });
}

/**
 * Runs work while holding a lock on a path, and releases the lock whether the work resolved or
 * threw.
 *
 * @remarks
 *   Exclusion reaches only as far as other callers of this function on the same path. The
 *   directories above that path are created, and the path itself becomes the lock directory. A hung
 *   owner produces an error carrying its process id once the wait runs out, so a caller never
 *   blocks indefinitely.
 * @returns The value the work resolved to.
 * @throws {@link Error} When the lock cannot be taken within the wait, or the work throws.
 */
export async function withLock<Result>(
  at: string,
  work: () => Promise<Result>,
  locking: Locking = {},
): Promise<Result> {
  mkdirSync(dirname(at), { recursive: true });
  await acquired(at, { grace: locking.grace ?? GRACE, wait: locking.wait ?? WAIT });

  try {
    return await work();
  } finally {
    rmSync(at, { force: true, recursive: true });
  }
}
