/**
 * Covers the lock: it is held for the work, waited for, taken over from a dead owner, refused after
 * the wait, and honoured by a second process.
 *
 * @remarks
 *   The file system is stood in for on one call alone, moving an abandoned lock aside, and only
 *   where a case asks for a failure: the two failures there are a race with another waiter and a
 *   permission, which no scratch workspace produces on demand. A case sets the failure for the next
 *   call and no other.
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, type PathLike, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { describe, expect, it, vi } from "vitest";

import { withScratchWorkspaceAsync } from "@stealthscale/testing";

import { withLock } from "#lock.ts";

/**
 * The failure the next move aside throws, where a case set one.
 */
const failing = vi.hoisted(() => ({ rename: undefined as Error | undefined }));

vi.mock(import("node:fs"), async (importOriginal) => {
  const actual = await importOriginal();

  /**
   * Moves a file, or throws the failure the next case set.
   */
  const renameSync = (from: PathLike, to: PathLike): void => {
    if (failing.rename !== undefined) {
      const held = failing.rename;

      failing.rename = undefined;
      throw held;
    }

    actual.renameSync(from, to);
  };

  return { ...actual, default: { ...actual, renameSync }, renameSync };
});

/**
 * The lock module, as a child process imports it.
 */
const LOCK = new URL("lock.ts", import.meta.url).pathname;

/**
 * The script a child runs: it takes the lock, logs, waits a moment, logs again and releases.
 */
const CHILD = [
  'import { appendFileSync } from "node:fs";',
  `import { withLock } from ${JSON.stringify(LOCK)};`,
  "const [at, log, tag] = process.argv.slice(2);",
  "await withLock(at, async () => {",
  "  appendFileSync(log, `${tag} start\\n`);",
  "  await new Promise((resolve) => setTimeout(resolve, 100));",
  "  appendFileSync(log, `${tag} end\\n`);",
  "});",
  "",
].join("\n");

/**
 * Runs a script in a child process and resolves to its exit code.
 */
function ran(script: string, args: readonly string[]): Promise<null | number> {
  return new Promise((resolve) => {
    spawn(process.execPath, [script, ...args], { stdio: "ignore" }).on("exit", (code) => {
      resolve(code);
    });
  });
}

/**
 * Returns the id of a process that has already exited.
 */
function deadPid(): number {
  return spawnSync(process.execPath, ["-e", ""]).pid;
}

/**
 * Lays a lock down by hand, as a process that took it would have, with the owner given or none.
 */
function laid(at: string, owner?: { pid: number; since: string }): void {
  mkdirSync(at, { recursive: true });
  if (owner !== undefined) writeFileSync(join(at, "owner.json"), JSON.stringify(owner));
}

/**
 * Builds an error carrying the code the file system would have put on it.
 */
function coded(code: string): Error {
  return Object.assign(new Error(code), { code });
}

describe("withLock", () => {
  it("holds the lock while the work runs and releases it afterwards", async () => {
    const held = await withScratchWorkspaceAsync({}, async (workspace) => {
      const at = workspace.path("locks/generation");
      const during = await withLock(at, () => Promise.resolve(existsSync(join(at, "owner.json"))));

      return { after: existsSync(at), during };
    });

    expect(held).toStrictEqual({ after: false, during: true });
  });

  it("releases the lock when the work throws", async () => {
    expect.hasAssertions();

    const left = await withScratchWorkspaceAsync({}, async (workspace) => {
      const at = workspace.path("lock");
      const failed = withLock(at, () => Promise.reject(new Error("the work failed")));

      await expect(failed).rejects.toThrow("the work failed");

      return existsSync(at);
    });

    expect(left).toBe(false);
  });

  it("runs a second caller once the first has released", async () => {
    const order = await withScratchWorkspaceAsync({}, async (workspace) => {
      const at = workspace.path("lock");
      const seen: string[] = [];
      const first = withLock(at, async () => {
        seen.push("a start");
        await sleep(60);
        seen.push("a end");
      });
      const second = withLock(at, () => {
        seen.push("b start", "b end");

        return Promise.resolve();
      });

      await Promise.all([first, second]);

      return seen;
    });

    expect(order).toStrictEqual(["a start", "a end", "b start", "b end"]);
  });

  it("takes over a lock whose owner is no longer running", async () => {
    const outcome = await withScratchWorkspaceAsync({}, (workspace) => {
      const at = workspace.path("lock");

      laid(at, { pid: deadPid(), since: "2026-09-21T00:00:00.000Z" });

      return withLock(at, () => Promise.resolve("ran"), { wait: 500 });
    });

    expect(outcome).toBe("ran");
  });

  it("takes over a lock that records no owner once the grace has passed", async () => {
    const outcome = await withScratchWorkspaceAsync({}, (workspace) => {
      const at = workspace.path("lock");

      laid(at);

      return withLock(at, () => Promise.resolve("ran"), { grace: 50, wait: 500 });
    });

    expect(outcome).toBe("ran");
  });

  it("reads an owner file that names no process as no owner", async () => {
    const outcome = await withScratchWorkspaceAsync({}, (workspace) => {
      const at = workspace.path("lock");

      laid(at);
      writeFileSync(join(at, "owner.json"), JSON.stringify({ pid: "nobody" }));

      return withLock(at, () => Promise.resolve("ran"), { grace: 50, wait: 500 });
    });

    expect(outcome).toBe("ran");
  });

  it("gives up on a lock a living process holds and names the owner", async () => {
    expect.hasAssertions();

    await withScratchWorkspaceAsync({}, async (workspace) => {
      const at = workspace.path("lock");

      laid(at, { pid: process.pid, since: "2026-09-21T00:00:00.000Z" });

      await expect(withLock(at, () => Promise.resolve(), { wait: 60 })).rejects.toThrow(
        `held by process ${String(process.pid)} since 2026-09-21T00:00:00.000Z`,
      );
    });
  });

  it("rethrows a failure to create the lock that is not the lock existing", async () => {
    expect.hasAssertions();

    await withScratchWorkspaceAsync({}, async (workspace) => {
      const at = workspace.path("a".repeat(300));

      await expect(withLock(at, () => Promise.resolve())).rejects.toThrow("ENAMETOOLONG");
    });
  });

  it("tries again when somebody else moved the abandoned lock aside first", async () => {
    const outcome = await withScratchWorkspaceAsync({}, (workspace) => {
      const at = workspace.path("lock");

      laid(at, { pid: deadPid(), since: "2026-09-21T00:00:00.000Z" });
      failing.rename = coded("ENOENT");

      return withLock(at, () => Promise.resolve("ran"), { wait: 500 });
    });

    expect(outcome).toBe("ran");
  });

  it("rethrows a failure to move an abandoned lock aside", async () => {
    expect.hasAssertions();

    await withScratchWorkspaceAsync({}, async (workspace) => {
      const at = workspace.path("lock");

      laid(at, { pid: deadPid(), since: "2026-09-21T00:00:00.000Z" });
      failing.rename = new Error("the disk is gone");

      await expect(withLock(at, () => Promise.resolve(), { wait: 500 })).rejects.toThrow(
        "the disk is gone",
      );
    });
  });

  it("serialises two processes", async () => {
    const lines = await withScratchWorkspaceAsync({ "child.mjs": CHILD }, async (workspace) => {
      const at = workspace.path("lock");
      const log = workspace.path("log.txt");
      const script = workspace.path("child.mjs");

      writeFileSync(log, "");

      const codes = await Promise.all([ran(script, [at, log, "a"]), ran(script, [at, log, "b"])]);

      return { codes, lines: readFileSync(log, "utf8").trim().split("\n") };
    });
    const tag = lines.lines[0]?.split(" ")[0] ?? "";

    expect(lines.codes).toStrictEqual([0, 0]);
    expect(lines.lines).toHaveLength(4);
    expect(lines.lines.slice(0, 2)).toStrictEqual([`${tag} start`, `${tag} end`]);
  });
});
