/**
 * Catalogue page for the em element.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The example renders the stressed run inside a
 *   `Text` line, because stress is relative to the surrounding text. The tone scene renders the
 *   inverted ink on `bg.inverted` through `grounded`. Every scene renders the example and shows it
 *   as its source. The words are keys under `em` in `locales/en/specimen/em.json`.
 */

import { grounded, scenesOf, specimen } from "@stealthscale/specimen";

import * as exported from "#em/examples/export.example.tsx";
import { recipe } from "#em/recipe.ts";

export default specimen({
  about: "em.about",
  id: "components/typography/em",
  imports: 'import { Em, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<Parameters<typeof exported.Export>[0]>(recipe, {
    axes: {
      tone: { draw: (props) => grounded(props.tone, <exported.Export {...props} />) },
    },
    draw: (props) => <exported.Export {...props} />,
    example: exported,
    namespace: "em",
    order: ["tone", "motion"],
  }),
  title: "em.title",
});
