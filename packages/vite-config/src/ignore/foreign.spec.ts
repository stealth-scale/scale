/**
 * Proves the foreign globs name every tree a tool should walk past, and that the copies of this
 * repository are left out below a root and counted inside one.
 */

import { matchesGlob } from "node:path";
import { describe, expect, it } from "vitest";

import { COPIES, copiesBelow, COPY_TESTS, FOREIGN } from "#ignore/foreign.ts";

const MAIN = "/repository";

const INSIDE = `${MAIN}/.claude/worktrees/one`;

const SNAPSHOT = `${MAIN}/.scratch/review/snapshot`;

describe("foreign", () => {
  it("names the installed built and reported directories", () => {
    expect(FOREIGN).toStrictEqual([
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/coverage/**",
    ]);
  });

  it("keeps the two directories a runner already walks past", () => {
    expect(FOREIGN).toContain("**/node_modules/**");
    expect(FOREIGN).toContain("**/.git/**");
  });

  it("names the worktrees and the scratch as the copies of this repository", () => {
    expect(COPIES).toStrictEqual([".claude", ".scratch"]);
  });

  it("names no copy glob that matches the segment anywhere in a path", () => {
    expect(FOREIGN.some((glob) => COPIES.some((directory) => glob.includes(directory)))).toBe(
      false,
    );
  });

  it("walks past the copies below the root when collecting test files", () => {
    expect(COPY_TESTS).toStrictEqual([".claude/**", ".scratch/**"]);
    expect(matchesGlob(".claude/worktrees/one/src/a.spec.ts", COPY_TESTS[0] ?? "")).toBe(true);
    expect(matchesGlob(".scratch/review/snapshot/src/a.spec.ts", COPY_TESTS[1] ?? "")).toBe(true);
    expect(COPY_TESTS.some((glob) => matchesGlob("packages/one/src/a.spec.ts", glob))).toBe(false);
  });

  it("leaves every file of the copies below the main checkout out of its coverage", () => {
    const globs = copiesBelow(MAIN);

    expect(globs).toStrictEqual(["/repository/.claude/**", "/repository/.scratch/**"]);
    expect(globs.some((glob) => matchesGlob(`${INSIDE}/packages/one/src/a.ts`, glob))).toBe(true);
    expect(globs.some((glob) => matchesGlob(`${SNAPSHOT}/packages/one/src/a.ts`, glob))).toBe(true);
    expect(globs.some((glob) => matchesGlob(`${MAIN}/packages/one/src/a.ts`, glob))).toBe(false);
  });

  it("counts every file of a run inside a copy", () => {
    const globs = copiesBelow(INSIDE);

    expect(globs[0]).toBe("/repository/.claude/worktrees/one/.claude/**");
    expect(globs.some((glob) => matchesGlob(`${INSIDE}/packages/one/src/a.ts`, glob))).toBe(false);
  });
});
