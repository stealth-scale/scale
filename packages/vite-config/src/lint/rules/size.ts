/**
 * Caps the size of a source file, a function and a signature.
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
 *   A function is capped at 60 lines and a file at 300, so a file at its cap
 *   holds five functions.
 */
export const SIZE: Rules = {
  complexity: ["error", 10],
  "max-depth": ["error", 4],
  "max-lines": ["error", { max: 300, ...COUNTED }],
  "max-lines-per-function": ["error", { max: 60, ...COUNTED }],
  "max-params": ["error", 4],
};

/**
 * Caps a specification at 900 lines and leaves its functions uncapped.
 *
 * @remarks
 *   A specification writes one case per branch of the module it covers, so splitting it to fit the
 *   source cap spreads one module's cases over two files. The stylesheet plugin's specification
 *   passed twice the source cap, because it writes one fixture per compiler lifecycle it drives. A
 *   `describe` body is one function holding every case, so no function cap applies.
 */
export const SPEC_SIZE: Rules = {
  "max-lines": ["error", { max: 900, ...COUNTED }],
  "max-lines-per-function": "off",
};
