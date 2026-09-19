/**
 * Proves the foreign globs name every tree a tool should walk past, and that the agent worktrees
 * are left out below a root and counted inside one.
 */

import { matchesGlob } from "node:path";
import { describe, expect, it } from "vitest";

import { FOREIGN, WORKTREE_TESTS, WORKTREES, worktreesBelow } from "#ignore/foreign.ts";

const MAIN = "/repository";

const INSIDE = `${MAIN}/.claude/worktrees/one`;

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

  it("names no worktree glob that matches the segment anywhere in a path", () => {
    expect(FOREIGN.some((glob) => glob.includes(WORKTREES))).toBe(false);
  });

  it("walks past the worktrees below the root when collecting test files", () => {
    expect(WORKTREE_TESTS).toBe(".claude/**");
    expect(matchesGlob(".claude/worktrees/one/src/a.spec.ts", WORKTREE_TESTS)).toBe(true);
    expect(matchesGlob("packages/one/src/a.spec.ts", WORKTREE_TESTS)).toBe(false);
  });

  it("leaves every file of the worktrees below the main checkout out of its coverage", () => {
    const glob = worktreesBelow(MAIN);

    expect(glob).toBe("/repository/.claude/**");
    expect(matchesGlob(`${INSIDE}/packages/one/src/a.ts`, glob)).toBe(true);
    expect(matchesGlob(`${MAIN}/packages/one/src/a.ts`, glob)).toBe(false);
  });

  it("counts every file of a run inside a worktree", () => {
    const glob = worktreesBelow(INSIDE);

    expect(glob).toBe("/repository/.claude/worktrees/one/.claude/**");
    expect(matchesGlob(`${INSIDE}/packages/one/src/a.ts`, glob)).toBe(false);
  });
});
