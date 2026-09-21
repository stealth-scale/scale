/**
 * Covers which trees the foreign globs match, and whether a path under a copy of this repository
 * is excluded below a root and counted inside one.
 */

import { matchesGlob } from "node:path";
import { describe, expect, it } from "vitest";

import { COPIES, copiesBelow, COPY_TESTS, FOREIGN } from "#ignore/foreign.ts";

const MAIN = "/repository";

const INSIDE = `${MAIN}/.claude/worktrees/one`;

const SNAPSHOT = `${MAIN}/.scratch/review/snapshot`;

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

  it("carries no glob mentioning a copy's own segment", () => {
    expect(FOREIGN.some((glob) => COPIES.some((directory) => glob.includes(directory)))).toBe(
      false,
    );
  });

  it("names one glob per copy relative to the root", () => {
    expect(COPY_TESTS).toStrictEqual([".claude/**", ".scratch/**"]);
  });

  it("matches a spec file under a worktree when collecting test files", () => {
    const file = ".claude/worktrees/one/src/a.spec.ts";

    expect(COPY_TESTS.some((glob) => matchesGlob(file, glob))).toBe(true);
  });

  it("matches a spec file under a snapshot when collecting test files", () => {
    const file = ".scratch/review/snapshot/src/a.spec.ts";

    expect(COPY_TESTS.some((glob) => matchesGlob(file, glob))).toBe(true);
  });

  it("leaves a spec file under packages unmatched when collecting test files", () => {
    expect(COPY_TESTS.some((glob) => matchesGlob("packages/one/src/a.spec.ts", glob))).toBe(false);
  });

  it("anchors one absolute glob per copy at the main checkout", () => {
    expect(copiesBelow(MAIN)).toStrictEqual(["/repository/.claude/**", "/repository/.scratch/**"]);
  });

  it("matches a file inside a worktree with the globs anchored at the main checkout", () => {
    const globs = copiesBelow(MAIN);

    expect(globs.some((glob) => matchesGlob(`${INSIDE}/packages/one/src/a.ts`, glob))).toBe(true);
  });

  it("matches a file inside a snapshot with the globs anchored at the main checkout", () => {
    const globs = copiesBelow(MAIN);

    expect(globs.some((glob) => matchesGlob(`${SNAPSHOT}/packages/one/src/a.ts`, glob))).toBe(true);
  });

  it("leaves a file under the main checkout's own packages unmatched", () => {
    const globs = copiesBelow(MAIN);

    expect(globs.some((glob) => matchesGlob(`${MAIN}/packages/one/src/a.ts`, glob))).toBe(false);
  });

  it("leaves a file of a run inside a copy unmatched by that run's own globs", () => {
    const globs = copiesBelow(INSIDE);

    expect(globs).toStrictEqual([`${INSIDE}/.claude/**`, `${INSIDE}/.scratch/**`]);
    expect(globs.some((glob) => matchesGlob(`${INSIDE}/packages/one/src/a.ts`, glob))).toBe(false);
  });
});
