/**
 * Globs excluding the directories that hold nothing this repository wrote.
 */

/**
 * Globs matching the installed, built and reported trees, for any tool that walks the repository.
 *
 * @remarks
 *   A coverage report and a test run both walk from the repository root, and
 *   either would descend into every installed package given the chance. These
 *   are ordinary globs rather than one runner's built-in defaults, so the same
 *   exclusions reach a tool that ships with none.
 */
export const FOREIGN = ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/coverage/**"];

/**
 * Directories under a workspace root holding a second copy of this repository: the worktrees an
 * agent session checks out, and the scratch a review or a gate snapshots into.
 *
 * @remarks
 *   A run from the main checkout's root that descended into either would count every file twice
 *   and run every specification again. Measured on 21 September 2026: a snapshot left under
 *   `.scratch` put 1308 of the 2638 files of the root coverage report outside the tree anybody
 *   wrote, and the report read 50.93% against a threshold of 100%. Each directory holds roots of
 *   its own, so a glob matching the segment anywhere in a path would exclude every file of a run
 *   inside one, and the coverage provider matches a glob anywhere in an absolute path. The globs
 *   below are therefore anchored at the root.
 */
export const COPIES = [".claude", ".scratch"];

/**
 * Globs matching every test file under the copies, relative to the root, which is how the
 * runner globs its test files.
 */
export const COPY_TESTS = COPIES.map((directory) => `${directory}/**`);

/**
 * Builds the absolute globs matching every file under the copies below `root`, which is the form
 * the coverage provider matches a file against.
 *
 * @remarks
 *   Measured on vitest 4.1.11: `isIncluded` matches the absolute file name with `contains: true`,
 *   so a relative glob excludes every file of a root that sits inside another checkout's copies,
 *   and the run reports 0 of 0 lines covered at 100%.
 * @param root - The absolute path of the checkout the copies sit under.
 */
export function copiesBelow(root: string): readonly string[] {
  return COPIES.map((directory) => `${root}/${directory}/**`);
}
