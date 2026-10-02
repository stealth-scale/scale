/**
 * Catalogue page for inline code.
 *
 * @remarks
 *   `scenesOf` generates the look scene, crossed with the size axis, and the palette scene, crossed
 *   with the look axis. A hand-written scene renders a command inside a line of body text. Every
 *   scene renders a component from `examples/` and shows that file as its source. Code is literal
 *   and the other words are keys under `code` in `locales/en/specimen/code.json`.
 */

import { type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as failure from "#code/examples/failure.example.tsx";
import * as install from "#code/examples/install.example.tsx";
import * as sentence from "#code/examples/sentence.example.tsx";
import { recipe } from "#code/recipe.ts";

/**
 * Hand-written scene for a command inside a line of body text.
 */
export const inline: Scene = {
  about: "code.sentence.about",
  draw: sentence.Sentence,
  example: sentence,
  title: "code.sentence.title",
};

export default specimen({
  about: "code.about",
  id: "components/typography/code",
  imports: 'import { Code } from "@stealthscale/component-typography";',
  scenes: [
    ...scenesOf<Parameters<typeof install.Install>[0]>(recipe, {
      axes: {
        palette: {
          across: "variant",
          draw: (props) => <failure.Failure {...props} />,
          example: failure,
        },
        variant: { across: "size" },
      },
      draw: (props) => <install.Install {...props} />,
      example: install,
      namespace: "code",
      order: ["variant", "palette"],
    }),
    inline,
  ],
  title: "code.title",
});
