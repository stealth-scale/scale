/**
 * Shows the code snippet: every look at both sizes, and every status in every look.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The size is crossed with the look and the look with the status, because each
 *   pair reads as a grid rather than as two lists. The snippets are code rather than words, so
 *   they are written here and not translated: a command where the look is what changes, and the
 *   name of an error where the status is. The scene words are keys under `code` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/code.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen } from "@stealthscale/specimen";

import { Code, type CodeProps } from "#code/code.ts";
import { recipe } from "#code/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "pnpm add",
  imports: 'import { Code } from "@stealthscale/component-typography";',
  name: "Code",
};

/**
 * Draws a command, which is what a look and a size are read against.
 */
function Command(props: CodeProps): ReactElement {
  return <Code {...props}>pnpm add</Code>;
}

/**
 * Draws the name of an error, which is what a status is read against.
 */
function Failure(props: CodeProps): ReactElement {
  return <Code {...props}>ENOENT</Code>;
}

export default specimen({
  about: "code.about",
  id: "components/typography/code",
  imports: 'import { Code } from "@stealthscale/component-typography";',
  scenes: scenesOf<CodeProps>(recipe, {
    axes: {
      status: { across: "variant", draw: (props) => <Failure {...props} /> },
      variant: { across: "size" },
    },
    draw: (props) => <Command {...props} />,
    namespace: "code",
    order: ["variant", "status"],
    sample: SAMPLE,
  }),
  title: "code.title",
});
