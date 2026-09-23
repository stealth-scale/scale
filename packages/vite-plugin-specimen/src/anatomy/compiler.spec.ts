import { describe, expect, it } from "vitest";

import { withScratchWorkspaceAsync } from "@stealthscale/testing";

import { type Compiler, compiler } from "#anatomy/compiler.ts";
import { kit } from "#anatomy/kit.fixtures.ts";
import { settled } from "#anatomy/reading.ts";

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

function opened<Result>(
  run: (held: Compiler, path: (relative: string) => string) => Result,
  files: Readonly<Record<string, string>> = kit(),
): Promise<Result> {
  return withScratchWorkspaceAsync(files, async (scratch) => {
    const held = await compiler(scratch.root);

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
    ).rejects.toThrow(/a project holding .*elsewhere\.ts/u);
  });

  it("closes without an error when it was never started", async () => {
    const held = await withScratchWorkspaceAsync(kit(), (scratch) => compiler(scratch.root));

    expect(() => {
      held.close();
    }).not.toThrow();
  });
});
