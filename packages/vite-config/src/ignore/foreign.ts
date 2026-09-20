/**
 * Excludes the directories holding nothing this repository wrote.
 */

/**
 * The globs matching installed, built and reported trees.
 *
 * @remarks
 *   A coverage report and a test run both walk from the repository root, and
 *   either would descend into every installed package given the chance. These
 *   are ordinary globs rather than one runner's built-in defaults, so the same
 *   exclusions reach a tool that ships with none.
 */
export const FOREIGN = ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/coverage/**"];

/**
 * The directory under a workspace root that holds the worktrees an agent session checks out.
 *
 * @remarks
 *   Each worktree is a second copy of this repository, and a run from the main checkout's root
 *   that descended into one would count every file twice and run every specification again. A
 *   worktree is itself a root below that directory, so a glob matching the segment anywhere in a
 *   path would exclude every file of a run inside one, and the coverage provider matches a glob
 *   anywhere in an absolute path. The two globs below are therefore anchored at the root.
 */
export const WORKTREES = ".claude";

/**
 * Matches every test file under the agent worktrees below the root, relative to the root, which
 * is how the runner globs its test files.
 */
export const WORKTREE_TESTS = `${WORKTREES}/**`;

/**
 * Matches every file under the agent worktrees below `root`, as an absolute path, which is how the
 * coverage provider matches a file against its exclusions.
 *
 * @remarks
 *   Measured on vitest 4.1.11: `isIncluded` matches the absolute file name with `contains: true`,
 *   so a relative glob excludes every file of a root that sits inside another checkout's
 *   worktrees directory, and the run reports 0 of 0 lines covered at 100%.
 */
export function worktreesBelow(root: string): string {
  return `${root}/${WORKTREES}/**`;
}
