/**
 * Catalogue page for the highlight.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The palette scene crosses the look axis and
 *   renders the highlighted word alone, so each of its 48 cells is one line in a 95px column at
 *   1280px. The other scenes render the highlight inside a `Text` line, because a highlight is read
 *   against the surrounding text. The corner scene crosses the inset axis. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under `mark`
 *   in `locales/en/specimen/mark.json`.
 */

import { scenesOf, specimen } from "@stealthscale/specimen";

import * as hit from "#mark/examples/hit.example.tsx";
import * as term from "#mark/examples/term.example.tsx";
import { recipe } from "#mark/recipe.ts";

export default specimen({
  about: "mark.about",
  id: "components/typography/mark",
  imports: 'import { Mark, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<Parameters<typeof hit.Hit>[0]>(recipe, {
    axes: {
      palette: {
        across: "variant",
        draw: (props) => <term.Term {...props} />,
        example: term,
      },
      radius: { across: "inset" },
    },
    draw: (props) => <hit.Hit {...props} />,
    example: hit,
    namespace: "mark",
    order: ["palette", "radius", "effect", "motion"],
  }),
  title: "mark.title",
});
