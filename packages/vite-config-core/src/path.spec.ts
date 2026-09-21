/**
 * Covers what a dotted path grows, creates and replaces on the way to a list.
 */

import { describe, expect, it } from "vitest";

import { appended } from "#path.ts";

describe("path", () => {
  it("appends to a list that is already there", () => {
    expect(
      appended({ test: { setupFiles: ["./a.ts"] } }, "test.setupFiles", "./b.ts"),
    ).toStrictEqual({
      test: { setupFiles: ["./a.ts", "./b.ts"] },
    });
  });

  it("creates the array and every level above it when absent", () => {
    expect(appended({}, "test.setupFiles", "./a.ts")).toStrictEqual({
      test: { setupFiles: ["./a.ts"] },
    });
  });

  it("leaves what it did not walk untouched", () => {
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

  it("appends at the top when the path names one step", () => {
    expect(appended({}, "plugins", "one")).toStrictEqual({ plugins: ["one"] });
  });

  it("reaches every object of a list on the way to the path", () => {
    expect(
      appended({ pack: [{ dts: true }, { plugins: ["a"] }, 3] }, "pack.plugins", "b"),
    ).toStrictEqual({ pack: [{ dts: true, plugins: ["b"] }, { plugins: ["a", "b"] }, 3] });
  });
});
