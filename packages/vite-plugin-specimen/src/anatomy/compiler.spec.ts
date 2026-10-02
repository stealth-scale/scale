import { API } from "typescript/unstable/sync";
import { describe, expect, it, vi } from "vitest";

import { withScratchWorkspaceAsync } from "@stealthscale/testing";
import { dependencies } from "@stealthscale/vite-plugin-base";

import { type Compiler, compiler } from "#anatomy/compiler.ts";
import { compilingIn, kit } from "#anatomy/kit.fixtures.ts";
import { settled } from "#anatomy/reading.ts";

vi.mock(import("@stealthscale/vite-plugin-base"), async (importOriginal) => {
  const original = await importOriginal();

  return { ...original, dependencies: vi.fn(original.dependencies) };
});

const EXAMPLED = {
  ...kit(),
  "src/badge/exampled.specimen.tsx": [
    'import * as example from "#badge/examples/badge.example.tsx";',
    "",
    'export default specimen({ id: "exampled", scenes: [example] });',
    "",
  ].join("\n"),
  "src/badge/examples/badge.example.tsx": [
    'import { Badge } from "#badge/badge.ts";',
    "",
    "export const Example = Badge;",
    "",
  ].join("\n"),
};

const TWICE = {
  ...EXAMPLED,
  "src/badge/twice.specimen.tsx": [
    'import { type BadgeProps } from "#badge/badge.ts";',
    'import * as example from "#badge/examples/badge.example.tsx";',
    "",
    'export default specimen({ id: "twice", scenes: [example] });',
    "",
  ].join("\n"),
};

function opened<Result>(
  run: (held: Compiler, path: (relative: string) => string) => Result,
  files: Readonly<Record<string, string>> = kit(),
): Promise<Result> {
  return withScratchWorkspaceAsync(files, async (scratch) => {
    const held = await compiler(
      scratch.root,
      compilingIn(files, (relative) => scratch.path(relative)),
    );

    try {
      return run(held, (relative) => scratch.path(relative));
    } finally {
      held.close();
    }
  });
}

describe("compiler", () => {
  it("reads the parts of the modules a specimen imports", async () => {
    const held = await opened((compiled, path) =>
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({})),
    );

    expect(Object.keys(held.parts).toSorted()).toStrictEqual(["BadgeProps", "OtherProps"]);
  });

  it("reads the parts of the modules an imported example file imports", async () => {
    const held = await opened(
      (compiled, path) => compiled.anatomyOf(path("src/badge/exampled.specimen.tsx"), settled({})),
      EXAMPLED,
    );

    expect(Object.keys(held.parts)).toStrictEqual(["BadgeProps"]);
  });

  it("records every type a chain refers to when an example imports the specimen's module too", async () => {
    const held = await opened(
      (compiled, path) => compiled.anatomyOf(path("src/badge/twice.specimen.tsx"), settled({})),
      TWICE,
    );
    const chain = held.parts["BadgeProps"]?.find((one) => one.name === "chain");

    expect(chain?.refers).toStrictEqual(["kit.Deep1", "kit.Deep2", "kit.Deep3"]);
  });

  it("reads the dependencies of a package once for two of its specimens", async () => {
    await opened((compiled, path) => {
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
      compiled.anatomyOf(path("src/parts.specimen.tsx"), settled({}));
    });

    expect(vi.mocked(dependencies)).toHaveBeenCalledTimes(1);
  });

  it("reads the dependencies of a package again after a restart", async () => {
    await opened((compiled, path) => {
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
      compiled.restart();
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
    });

    expect(vi.mocked(dependencies)).toHaveBeenCalledTimes(2);
  });

  it("opens every page's program in one snapshot", async () => {
    const opening = vi.spyOn(API.prototype, "updateSnapshot");

    await opened((compiled, path) => {
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
      compiled.anatomyOf(path("src/overlay/overlay.specimen.tsx"), settled({}));
      compiled.anatomyOf(path("src/parts.specimen.tsx"), settled({}));
    });

    expect(opening).toHaveBeenCalledTimes(1);
  });

  it("reads a second specimen in the same process", async () => {
    const held = await opened((compiled, path) => {
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));

      return compiled.anatomyOf(path("src/parts.specimen.tsx"), settled({}));
    });

    expect(Object.keys(held.parts)).toStrictEqual(["BadgeProps"]);
  });

  it("reads one specimen twice without reopening it", async () => {
    const held = await opened((compiled, path) => {
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));

      return compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
    });

    expect(Object.keys(held.parts)).toHaveLength(2);
  });

  it("reads the files again after a restart", async () => {
    const held = await opened((compiled, path) => {
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
      compiled.restart();

      return compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
    });

    expect(Object.keys(held.parts)).toHaveLength(2);
  });

  it("throws with the file path when no project contains the file", async () => {
    await expect(
      opened((compiled, path) => compiled.anatomyOf(path("elsewhere.ts"), settled({}))),
    ).rejects.toThrow(/a project containing .*elsewhere\.ts/u);
  });

  it("closes without an error when it was never started", async () => {
    const held = await withScratchWorkspaceAsync(kit(), (scratch) =>
      compiler(
        scratch.root,
        compilingIn(kit(), (relative) => scratch.path(relative)),
      ),
    );

    expect(() => {
      held.close();
    }).not.toThrow();
  });
});
