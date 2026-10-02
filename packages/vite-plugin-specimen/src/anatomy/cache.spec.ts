import { mkdirSync, symlinkSync, writeFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { type ScratchWorkspace, withScratchWorkspaceAsync } from "@stealthscale/testing";

import { type Store, store } from "#anatomy/cache.ts";
import { settled } from "#anatomy/reading.ts";
import { type Anatomy } from "#contract.ts";

const EMPTY: Anatomy = { dropped: {}, parts: {}, shapes: {} };

const SPECIMEN = "a/src/a.specimen.tsx";

/**
 * A workspace laid out the way pnpm lays one out: the page's package `a` depends on `b`, peers on
 * `c` and develops against `d`; `b` and `c` both depend on `f`; `e` is unrelated; `x` is installed.
 */
const TREE = {
  "a/node_modules/x/index.d.ts": "export {};\n",
  "a/node_modules/x/package.json": '{ "name": "x" }',
  "a/package.json": JSON.stringify({
    dependencies: { b: "workspace:*", missing: "1.0.0", x: "1.0.0" },
    devDependencies: { d: "workspace:*" },
    name: "a",
    peerDependencies: { c: "workspace:*" },
  }),
  "a/src/a.specimen.tsx": "",
  "a/src/a.ts": "export const a = 1;\n",
  "b/package.json": JSON.stringify({ dependencies: { f: "workspace:*" }, name: "b" }),
  "b/src/b.ts": "export const b = 1;\n",
  "c/package.json": JSON.stringify({ dependencies: { f: "workspace:*" }, name: "c" }),
  "c/src/c.ts": "export const c = 1;\n",
  "d/package.json": '{ "name": "d" }',
  "d/web.json": "{}",
  "e/package.json": '{ "name": "e" }',
  "e/src/e.ts": "export const e = 1;\n",
  "f/package.json": '{ "name": "f" }',
  "f/src/f.ts": "export const f = 1;\n",
  "loose/loose.specimen.tsx": "",
  "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
};

/**
 * Links each workspace package where its dependents resolve it, as the package manager does.
 */
function linked(scratch: ScratchWorkspace): void {
  for (const [from, name] of [
    ["a", "b"],
    ["a", "c"],
    ["a", "d"],
    ["b", "f"],
    ["c", "f"],
  ] as const) {
    mkdirSync(scratch.path(`${from}/node_modules`), { recursive: true });
    symlinkSync(scratch.path(name), scratch.path(`${from}/node_modules/${name}`), "dir");
  }
}

/**
 * Serves the page of package `a` from a store twice, with a change to the workspace between, and
 * returns how many times the page was read.
 *
 * @param change - Changes the workspace, or leaves it alone.
 */
function readsAround(change: (scratch: ScratchWorkspace) => void): Promise<number> {
  return withScratchWorkspaceAsync(TREE, async (scratch) => {
    const read = vi.fn<() => Promise<Anatomy>>(() => Promise.resolve(EMPTY));
    const held: Store = store(scratch.path("cache"), settled({}));

    linked(scratch);
    await held.anatomyOf("a/page", scratch.path(SPECIMEN), read);
    change(scratch);
    held.forget();
    await held.anatomyOf("a/page", scratch.path(SPECIMEN), read);

    return read.mock.calls.length;
  });
}

describe("store", () => {
  it("reads a page once while its key is unchanged", async () => {
    await expect(readsAround(() => {})).resolves.toBe(1);
  });

  it("returns the anatomy the page was read to", async () => {
    const anatomy: Anatomy = { dropped: {}, parts: { RootProps: [] }, shapes: {} };
    const served = await withScratchWorkspaceAsync(TREE, async (scratch) => {
      const held = store(scratch.path("cache"), settled({}));

      linked(scratch);
      await held.anatomyOf("a/page", scratch.path(SPECIMEN), () => Promise.resolve(anatomy));

      return held.anatomyOf("a/page", scratch.path(SPECIMEN), () => Promise.resolve(EMPTY));
    });

    expect(served).toStrictEqual(anatomy);
  });

  it("serves a page to a second store from the disk", async () => {
    const reads = await withScratchWorkspaceAsync(TREE, async (scratch) => {
      const read = vi.fn<() => Promise<Anatomy>>(() => Promise.resolve(EMPTY));

      linked(scratch);
      await store(scratch.path("cache"), settled({})).anatomyOf(
        "a/page",
        scratch.path(SPECIMEN),
        read,
      );
      await store(scratch.path("cache"), settled({})).anatomyOf(
        "a/page",
        scratch.path(SPECIMEN),
        read,
      );

      return read.mock.calls.length;
    });

    expect(reads).toBe(1);
  });

  it("reads a page again when a file of its package changes", async () => {
    await expect(
      readsAround((scratch) => {
        scratch.write({ "a/src/a.ts": "export const a = 2;\n" });
      }),
    ).resolves.toBe(2);
  });

  it.each(["b/src/b.ts", "c/src/c.ts", "f/src/f.ts", "d/web.json"])(
    "reads a page again when %s changes",
    async (file) => {
      await expect(
        readsAround((scratch) => {
          scratch.write({ [file]: "changed\n" });
        }),
      ).resolves.toBe(2);
    },
  );

  it.each(["e/src/e.ts", "a/node_modules/x/index.d.ts"])(
    "keeps a page when %s changes",
    async (file) => {
      await expect(
        readsAround((scratch) => {
          scratch.write({ [file]: "changed\n" });
        }),
      ).resolves.toBe(1);
    },
  );

  it("reads a page again when the lockfile changes", async () => {
    await expect(
      readsAround((scratch) => {
        scratch.write({ "pnpm-lock.yaml": "lockfileVersion: '9.1'\n" });
      }),
    ).resolves.toBe(2);
  });

  it("reads a page again when the file it was kept in does not parse", async () => {
    await expect(
      readsAround((scratch) => {
        writeFileSync(scratch.path("cache/specimen/props/a%2Fpage.json"), "{");
      }),
    ).resolves.toBe(2);
  });

  it("reads a page again under another reading", async () => {
    const reads = await withScratchWorkspaceAsync(TREE, async (scratch) => {
      const read = vi.fn<() => Promise<Anatomy>>(() => Promise.resolve(EMPTY));

      linked(scratch);
      await store(scratch.path("cache"), settled({})).anatomyOf(
        "a/page",
        scratch.path(SPECIMEN),
        read,
      );
      await store(scratch.path("cache"), settled({ depth: 1 })).anatomyOf(
        "a/page",
        scratch.path(SPECIMEN),
        read,
      );

      return read.mock.calls.length;
    });

    expect(reads).toBe(2);
  });

  it("keys a page in no package by its directory", async () => {
    const served = await withScratchWorkspaceAsync(TREE, (scratch) =>
      store(scratch.path("cache"), settled({})).anatomyOf(
        "loose",
        scratch.path("loose/loose.specimen.tsx"),
        () => Promise.resolve(EMPTY),
      ),
    );

    expect(served).toStrictEqual(EMPTY);
  });

  it("keys a page in a workspace with no lockfile", async () => {
    const served = await withScratchWorkspaceAsync(
      { "a/package.json": '{ "name": "a" }', "a/src/a.specimen.tsx": "" },
      (scratch) =>
        store(scratch.path("cache"), settled({})).anatomyOf("a/page", scratch.path(SPECIMEN), () =>
          Promise.resolve(EMPTY),
        ),
    );

    expect(served).toStrictEqual(EMPTY);
  });
});
