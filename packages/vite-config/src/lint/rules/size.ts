/**
 * Caps how far a file, a function and a signature may grow.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * Counts neither blank lines nor comments towards a line limit, so a doc comment never pushes a
 * file over.
 */
const COUNTED = { skipBlankLines: true, skipComments: true } as const;

/**
 * Limits the length, the nesting, the branching and the parameter count.
 *
 * @remarks
 *   A function is capped at a fifth of what a file is, which leaves room for
 *   several of them in a file already at its cap.
 */
export const SIZE: Rules = {
  complexity: ["error", 10],
  "max-depth": ["error", 4],
  "max-lines": ["error", { max: 300, ...COUNTED }],
  "max-lines-per-function": ["error", { max: 60, ...COUNTED }],
  "max-params": ["error", 4],
};

/**
 * Caps a specification at three times the lines of a source file, and leaves its functions
 * uncapped.
 *
 * @remarks
 *   A specification writes one case per branch of the module it covers, and the module decides
 *   how many branches there are. Splitting a specification to fit a cap spreads one module's
 *   cases over two files, so the cap is raised instead. A specification that drives a plugin
 *   through a real compiler writes one fixture per lifecycle it covers, which is what took the
 *   stylesheet plugin's past twice the source cap. A `describe` body is one function that holds
 *   every case, so no function cap can apply.
 */
export const SPEC_SIZE: Rules = {
  "max-lines": ["error", { max: 900, ...COUNTED }],
  "max-lines-per-function": "off",
};
