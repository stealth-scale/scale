/**
 * Serialises work on a directory across processes.
 *
 * @remarks
 *   A generator renders a configuration, runs a compiler over it and publishes the result, and it
 *   holds mutable intermediates for the whole run. Two processes in one checkout, such as a type
 *   check beside a dev server, reach the same paths, and one reads what the other is writing. The
 *   lock is a directory, because creating one is atomic on every file system, and it records its
 *   owner so a lock a dead process left behind is taken over rather than waited on.
 */

import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

/**
 * The file inside the lock that names the process holding it.
 */
const OWNER = "owner.json";

/**
 * How long a waiter sleeps between two attempts, in milliseconds.
 */
const POLL = 25;

/**
 * How long a waiter waits for a living owner before it gives up, in milliseconds, unless told
 * otherwise.
 */
const WAIT = 30_000;

/**
 * How long a lock may stand without an owner file before it is read as abandoned, in
 * milliseconds, unless told otherwise.
 *
 * @remarks
 *   Taking a lock is two steps, creating the directory and writing the owner into it, and a process
 *   that dies between them leaves a lock nothing will release. The grace covers the gap between the
 *   two steps of a living process.
 */
const GRACE = 1000;

/**
 * Bounds how long a waiter tolerates a lock held by somebody else.
 */
export interface Locking {
  /**
   * How long a lock may stand with no owner recorded before it is taken over, in milliseconds.
   * One second where absent.
   */
  grace?: number | undefined;

  /**
   * How long to wait for a living owner before giving up, in milliseconds. Thirty seconds where
   * absent.
   */
  wait?: number | undefined;
}

/**
 * The bounds, with every value settled.
 */
interface Limits {
  /**
   * How long a lock may stand with no owner recorded before it is taken over, in milliseconds.
   */
  grace: number;

  /**
   * How long to wait for a living owner before giving up, in milliseconds.
   */
  wait: number;
}

/**
 * Records which process holds a lock, and since when.
 */
interface Owner {
  /**
   * The process holding the lock.
   */
  pid: number;

  /**
   * When it took the lock, as an ISO 8601 string.
   */
  since: string;
}

/**
 * Reads the code the file system put on an error, or nothing where there is none.
 *
 * @remarks
 *   The error is boxed before it is read, so whatever was thrown, an error, a string or nothing,
 *   is read the same way and a code is found only where an object carries one.
 */
function codeOf(error: unknown): string | undefined {
  const code: unknown = Reflect.get(new Object(error), "code");

  return typeof code === "string" ? code : undefined;
}

/**
 * Reports whether a parsed owner file has the shape one is written with.
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
 * Reads who holds a lock, or nothing where the owner file is absent or unreadable.
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
 * Reports whether a process is running.
 *
 * @remarks
 *   Signal zero tests for the process without touching it. A process that belongs to another user
 *   refuses the test with a permission error, and is running.
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
 * Takes the lock, and reports whether it was free.
 *
 * @throws {@link Error} When the directory cannot be created for any reason but that it exists.
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
 * Removes a lock its owner abandoned.
 *
 * @remarks
 *   The lock is moved aside before it is removed, because a rename succeeds for one process alone.
 *   Two waiters that both found the owner dead would otherwise both remove the lock, and the second
 *   removal could take away the lock a third process had taken in between.
 * @throws {@link Error} When the lock cannot be moved aside for any reason but that it is already
 *   gone.
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
 * Records what a waiter has seen of a lock so far.
 */
interface Waiting {
  /**
   * When the wait began.
   */
  started: number;

  /**
   * When the lock was first seen without an owner, or nothing while it has one.
   */
  unowned?: number | undefined;
}

/**
 * Decides what a waiter does about a lock it found taken: takes over an abandoned one, keeps
 * waiting on a held one, or gives up.
 *
 * @returns The state of the wait, for the next attempt.
 * @throws {@link Error} When a living owner holds the lock for longer than the wait allows. The
 *   message names the owner and when it took the lock.
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
 * Tries the lock, and tries again after a pause while somebody else holds it.
 */
async function waited(at: string, limits: Limits, seen: Waiting): Promise<void> {
  if (taken(at)) return;

  const next = considered(at, seen, limits);

  await sleep(POLL);

  return waited(at, limits, next);
}

/**
 * Waits until the lock is taken by this process.
 *
 * @throws {@link Error} When a living owner holds the lock for longer than the wait allows.
 */
function acquired(at: string, limits: Limits): Promise<void> {
  return waited(at, limits, { started: Date.now() });
}

/**
 * Runs work while holding a lock on a path, and releases the lock afterwards whatever the work did.
 *
 * @remarks
 *   The lock is a directory at the path, created with the owner's process id and the time inside
 *   it. A second process finding the directory waits and polls. A lock whose owner is no longer
 *   running, or that stood without an owner for longer than the grace, is taken over. A lock a
 *   living process holds for longer than the wait makes the waiter give up with an error naming
 *   the owner, so a hung process is found rather than waited on for ever.
 * @param at - The path of the lock directory. The directories above it are created.
 * @param work - The function to run while the lock is held.
 * @param locking - The bounds on waiting. The defaults apply where absent.
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
