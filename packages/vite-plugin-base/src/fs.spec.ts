/**
 * Covers the writes a generator makes: one that leaves an unchanged file alone, one that clears a
 * directory, and one that makes a directory match another.
 *
 * @remarks
 *   The unreadable-source case takes read permission off a directory, which a process running as
 *   root is not held to. Run the suite as an ordinary user.
 */

import { chmodSync, existsSync, statSync, utimesSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { emptyDir, syncDir, writeIfChanged } from "#fs.ts";

/**
 * Runs a function and returns the message it threw, or an empty string where it returned.
 */
function failing(run: () => void): string {
  try {
    run();

    return "";
  } catch (error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }
}

/**
 * Writes `content` to one file in a scratch workspace holding `files`, and reads the file back.
 */
function written(
  files: Readonly<Record<string, string>>,
  content: string,
): { readonly content: string; readonly wrote: boolean } {
  return withScratchWorkspace(files, (workspace) => {
    const wrote = writeIfChanged(workspace.path("a/b/c.txt"), content);

    return { content: workspace.read("a/b/c.txt"), wrote };
  });
}

/**
 * Syncs `from` into `to` in a scratch workspace holding `files`, and lists what is under `to`.
 */
function synced(files: Readonly<Record<string, string>>): readonly string[] {
  return withScratchWorkspace(files, (workspace) => {
    syncDir(workspace.path("from"), workspace.path("to"));

    return workspace.files().filter((file) => file.startsWith("to/"));
  });
}

describe("fs", () => {
  it("writes a file that does not exist and creates the directories above it", () => {
    expect(written({}, "one")).toStrictEqual({ content: "one", wrote: true });
  });

  it("returns false and leaves the file alone when the content is the same", () => {
    expect(written({ "a/b/c.txt": "one" }, "one")).toStrictEqual({ content: "one", wrote: false });
  });

  it("overwrites a file whose content differs", () => {
    expect(written({ "a/b/c.txt": "one" }, "two")).toStrictEqual({ content: "two", wrote: true });
  });

  it("leaves no staged file beside the one it wrote", () => {
    const files = withScratchWorkspace({ "a/b/c.txt": "one" }, (workspace) => {
      writeIfChanged(workspace.path("a/b/c.txt"), "two");

      return workspace.files();
    });

    expect(files).toStrictEqual(["a/b/c.txt"]);
  });

  it("throws when the file exists and cannot be read", () => {
    const message = withScratchWorkspace({ "a/b/c.txt": "one" }, (workspace) => {
      chmodSync(workspace.path("a/b/c.txt"), 0o000);

      try {
        return failing(() => {
          writeIfChanged(workspace.path("a/b/c.txt"), "two");
        });
      } finally {
        chmodSync(workspace.path("a/b/c.txt"), 0o644);
      }
    });

    expect(message).toMatch(/EACCES/u);
  });

  it("deletes a directory and everything under it", () => {
    const left = withScratchWorkspace({ "out/a.txt": "", "out/deep/b.txt": "" }, (workspace) => {
      emptyDir(workspace.path("out"));

      return existsSync(workspace.path("out"));
    });

    expect(left).toBe(false);
  });

  it("does nothing when the directory to empty is absent", () => {
    const left = withScratchWorkspace({}, (workspace) => {
      emptyDir(workspace.path("out"));

      return existsSync(workspace.path("out"));
    });

    expect(left).toBe(false);
  });

  it("writes every file of one directory into another that is absent", () => {
    expect(synced({ "from/a.txt": "a", "from/deep/b.txt": "b" })).toStrictEqual([
      "to/a.txt",
      "to/deep/b.txt",
    ]);
  });

  it("removes a file the source no longer holds", () => {
    expect(synced({ "from/a.txt": "a", "to/a.txt": "a", "to/stale.txt": "" })).toStrictEqual([
      "to/a.txt",
    ]);
  });

  it("removes a directory the source no longer holds", () => {
    const left = withScratchWorkspace(
      { "from/a.txt": "a", "to/gone/deep/stale.txt": "" },
      (workspace) => {
        syncDir(workspace.path("from"), workspace.path("to"));

        return existsSync(workspace.path("to/gone"));
      },
    );

    expect(left).toBe(false);
  });

  it("leaves an unchanged file as it was when the source still holds it", () => {
    const past = new Date("2020-01-01T00:00:00Z");
    const modified = withScratchWorkspace({ "from/a.txt": "a", "to/a.txt": "a" }, (workspace) => {
      utimesSync(workspace.path("to/a.txt"), past, past);
      syncDir(workspace.path("from"), workspace.path("to"));

      return statSync(workspace.path("to/a.txt")).mtime;
    });

    expect(modified).toStrictEqual(past);
  });

  it("overwrites a file whose content differs from the source", () => {
    const content = withScratchWorkspace(
      { "from/a.txt": "new", "to/a.txt": "old" },
      (workspace) => {
        syncDir(workspace.path("from"), workspace.path("to"));

        return workspace.read("to/a.txt");
      },
    );

    expect(content).toBe("new");
  });

  it("empties the target when the source is absent", () => {
    expect(synced({ "to/a.txt": "a" })).toStrictEqual([]);
  });

  it("stops before deleting anything when the source cannot be listed", () => {
    const outcome = withScratchWorkspace(
      { "from/a.txt": "a", "to/kept.txt": "kept" },
      (workspace) => {
        chmodSync(workspace.path("from"), 0o000);

        const message = failing(() => {
          syncDir(workspace.path("from"), workspace.path("to"));
        });

        chmodSync(workspace.path("from"), 0o755);

        return { files: workspace.files().filter((file) => file.startsWith("to/")), message };
      },
    );

    expect(outcome.message).toMatch(/EACCES/u);
    expect(outcome.files).toStrictEqual(["to/kept.txt"]);
  });

  it("does nothing when both directories are absent", () => {
    const created = withScratchWorkspace({}, (workspace) => {
      syncDir(workspace.path("from"), workspace.path("to"));

      return existsSync(workspace.path("to"));
    });

    expect(created).toBe(false);
  });
});
