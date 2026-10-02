/**
 * Covers which trees the foreign globs match, and which paths relative to a root the globs over
 * the copies of this repository match.
 */

import { matchesGlob } from "node:path";
import { describe, expect, it } from "vitest";

import { COPIES, FOREIGN, IN_COPIES } from "#ignore/foreign.ts";

describe("foreign", () => {
  it("lists the installed built and reported trees in a fixed order", () => {
    expect(FOREIGN).toStrictEqual([
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/coverage/**",
    ]);
  });

  it("restates the exclusions a runner already applies by default", () => {
    expect(FOREIGN).toContain("**/node_modules/**");
    expect(FOREIGN).toContain("**/.git/**");
  });

  it("names the worktrees and the scratch as the copies of this repository", () => {
    expect(COPIES).toStrictEqual([".claude", ".scratch"]);
  });

  it("keeps every copy's segment out of the foreign globs", () => {
    expect(FOREIGN.some((glob) => COPIES.some((directory) => glob.includes(directory)))).toBe(
      false,
    );
  });

  it("names one glob per copy relative to the root", () => {
    expect(IN_COPIES).toStrictEqual([".claude/**", ".scratch/**"]);
  });

  it("matches a file under a worktree", () => {
    const file = ".claude/worktrees/one/packages/one/src/a.ts";

    expect(IN_COPIES.some((glob) => matchesGlob(file, glob))).toBe(true);
  });

  it("matches a file under a snapshot", () => {
    const file = ".scratch/review/snapshot/packages/one/src/a.spec.ts";

    expect(IN_COPIES.some((glob) => matchesGlob(file, glob))).toBe(true);
  });

  it("leaves a file under the root's own packages unmatched", () => {
    expect(IN_COPIES.some((glob) => matchesGlob("packages/one/src/a.ts", glob))).toBe(false);
  });

  it("leaves a file unmatched when a copy's segment appears below the root", () => {
    expect(IN_COPIES.some((glob) => matchesGlob("packages/one/.scratch/a.ts", glob))).toBe(false);
  });
});
