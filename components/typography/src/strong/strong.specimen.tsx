/**
 * Catalogue page for the strong element.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The example renders the strong run inside a
 *   `Text` line, because importance is relative to the surrounding text. The tone scene crosses the
 *   weight axis and renders the inverted ink on `bg.inverted` through `grounded`. Every scene
 *   renders the example and shows it as its source. The words are keys under `strong` in
 *   `locales/en/specimen/strong.json`.
 */

import { grounded, scenesOf, specimen } from "@stealthscale/specimen";

import * as warning from "#strong/examples/warning.example.tsx";
import { recipe } from "#strong/recipe.ts";

export default specimen({
  about: "strong.about",
  id: "components/typography/strong",
  imports: 'import { Strong, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<Parameters<typeof warning.Warning>[0]>(recipe, {
    axes: {
      tone: {
        across: "weight",
        draw: (props) => grounded(props.tone, <warning.Warning {...props} />),
      },
    },
    draw: (props) => <warning.Warning {...props} />,
    example: warning,
    namespace: "strong",
    order: ["tone", "motion"],
  }),
  title: "strong.title",
});
