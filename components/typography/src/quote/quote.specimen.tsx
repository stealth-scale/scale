/**
 * Catalogue page for the inline quotation.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The example renders the quotation inside a
 *   `Text` line, because an inline quotation is read against the surrounding text. The tone scene
 *   renders the inverted ink on `bg.inverted` through `grounded`. Every scene renders the example
 *   and shows it as its source. The words are keys under `quote` in
 *   `locales/en/specimen/quote.json`.
 */

import { grounded, scenesOf, specimen } from "@stealthscale/specimen";

import * as audit from "#quote/examples/audit.example.tsx";
import { recipe } from "#quote/recipe.ts";

export default specimen({
  about: "quote.about",
  id: "components/typography/quote",
  imports: 'import { Quote, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<Parameters<typeof audit.Audit>[0]>(recipe, {
    axes: {
      tone: { draw: (props) => grounded(props.tone, <audit.Audit {...props} />) },
    },
    draw: (props) => <audit.Audit {...props} />,
    example: audit,
    namespace: "quote",
    order: ["marks", "tone", "motion"],
  }),
  title: "quote.title",
});
