/**
 * Globs excluding the directories that contain nothing this repository wrote.
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
 * Directories under a workspace root containing a second copy of this repository: the worktrees an
 * agent session checks out, and the scratch a review or a gate snapshots into.
 *
 * @remarks
 *   A run from the main checkout's root that descended into either would count every file twice
 *   and run every specification again. Measured on 21 September 2026: a snapshot left under
 *   `.scratch` put 1308 of the 2638 files of the root coverage report outside the tree anybody
 *   wrote, and the report read 50.93% against a threshold of 100%.
 */
export const COPIES = [".claude", ".scratch"];

/**
 * Globs matching every file under the copies, relative to the root.
 *
 * @remarks
 *   The runner collects test files and the coverage provider matches a covered file by the path
 *   relative to the root, so one list leaves the copies out of both. Measured on vitest 5.0.1: an
 *   absolute glob over a copy left out a file no test loaded and counted a file a test loaded,
 *   and the relative glob left out both. Each copy contains roots of its own, and a glob matching
 *   the segment anywhere in a path would exclude every file of a run inside one. The globs are
 *   therefore anchored at the root.
 */
export const IN_COPIES = COPIES.map((directory) => `${directory}/**`);
