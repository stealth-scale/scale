/**
 * Covers where a dotted path appends, what it creates on the way down, and what it replaces at the
 * end.
 */

import { describe, expect, it } from "vitest";

import { appended } from "#path.ts";

describe("path", () => {
  it("appends to the array already at the path", () => {
    expect(
      appended({ test: { setupFiles: ["./a.ts"] } }, "test.setupFiles", "./b.ts"),
    ).toStrictEqual({
      test: { setupFiles: ["./a.ts", "./b.ts"] },
    });
  });

  it("creates each missing level of the path", () => {
    expect(appended({}, "test.setupFiles", "./a.ts")).toStrictEqual({
      test: { setupFiles: ["./a.ts"] },
    });
  });

  it("keeps a sibling level by reference rather than copying it", () => {
    const untouched = { environment: "node" };
    const held = appended({ lint: {}, test: untouched }, "lint.layers", "one");

    expect(held["test"]).toBe(untouched);
  });

  it("replaces the value at the path when it is not an array", () => {
    expect(appended({ test: { setupFiles: "./a.ts" } }, "test.setupFiles", "./b.ts")).toStrictEqual(
      {
        test: { setupFiles: ["./b.ts"] },
      },
    );
  });

  it("appends at the top level when the path names one step", () => {
    expect(appended({}, "plugins", "one")).toStrictEqual({ plugins: ["one"] });
  });

  it("appends through every object of an array level", () => {
    expect(
      appended({ pack: [{ dts: true }, { plugins: ["a"] }] }, "pack.plugins", "b"),
    ).toStrictEqual({ pack: [{ dts: true, plugins: ["b"] }, { plugins: ["a", "b"] }] });
  });

  it("leaves an entry of an array level that is not an object alone", () => {
    expect(appended({ pack: [3] }, "pack.plugins", "b")).toStrictEqual({ pack: [3] });
  });
});
