/**
 * Which files the runner collects as tests, and where it does not look.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { FOREIGN, WORKTREE_TESTS } from "#ignore/foreign.ts";

/**
 * The one spelling of a test file this repository uses.
 */
const TESTS = ["**/*.spec.{ts,tsx}"];

/**
 * Collects the suite from files named .spec and from nowhere else.
 *
 * @remarks
 *   The runner recognises .test as well by default. Keeping one spelling means
 *   nobody has to check which a package chose, at the price that a file named
 *   .test is collected by nothing and reports no failure while doing it. The
 *   agent worktrees below the root are left out, so a run from the main checkout
 *   collects no specification twice.
 */
export function files(): Preset {
  return preset({
    config: { test: { exclude: [...FOREIGN, WORKTREE_TESTS], include: TESTS } },
    name: "test.files",
  });
}
