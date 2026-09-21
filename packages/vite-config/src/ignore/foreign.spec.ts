/**
 * Covers which trees the foreign globs match, and whether a path under the agent worktrees is
 * excluded below a root and counted inside one.
 */

import { matchesGlob } from "node:path";
import { describe, expect, it } from "vitest";

import { FOREIGN, WORKTREE_TESTS, WORKTREES, worktreesBelow } from "#ignore/foreign.ts";

const MAIN = "/repository";

const INSIDE = `${MAIN}/.claude/worktrees/one`;

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

  it("carries no glob mentioning the worktrees segment", () => {
    expect(FOREIGN.some((glob) => glob.includes(WORKTREES))).toBe(false);
  });

  it("matches a spec file under the worktrees with a glob relative to the root", () => {
    expect(WORKTREE_TESTS).toBe(".claude/**");
    expect(matchesGlob(".claude/worktrees/one/src/a.spec.ts", WORKTREE_TESTS)).toBe(true);
  });

  it("leaves a spec file under packages unmatched when collecting test files", () => {
    expect(matchesGlob("packages/one/src/a.spec.ts", WORKTREE_TESTS)).toBe(false);
  });

  it("matches a file inside a worktree with the glob anchored at the main checkout", () => {
    const glob = worktreesBelow(MAIN);

    expect(glob).toBe("/repository/.claude/**");
    expect(matchesGlob(`${INSIDE}/packages/one/src/a.ts`, glob)).toBe(true);
  });

  it("leaves a file under the main checkout's own packages unmatched", () => {
    expect(matchesGlob(`${MAIN}/packages/one/src/a.ts`, worktreesBelow(MAIN))).toBe(false);
  });

  it("leaves a file of a run inside a worktree unmatched by that run's own glob", () => {
    const glob = worktreesBelow(INSIDE);

    expect(glob).toBe("/repository/.claude/worktrees/one/.claude/**");
    expect(matchesGlob(`${INSIDE}/packages/one/src/a.ts`, glob)).toBe(false);
  });
});
