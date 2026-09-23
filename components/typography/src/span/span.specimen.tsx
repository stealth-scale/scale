/**
 * Catalogue page for the span.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. Every example renders the span inside a `Text`
 *   line. The tone scene crosses the weight axis and renders the inverted ink on `bg.inverted`
 *   through `grounded`. The truncation scene renders a log path in a 320px room. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `span` in `locales/en/specimen/span.json`.
 */

import { grounded, Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as path from "#span/examples/path.example.tsx";
import * as total from "#span/examples/total.example.tsx";
import { recipe } from "#span/recipe.ts";

export default specimen({
  about: "span.about",
  id: "components/typography/span",
  imports: 'import { Span, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<Parameters<typeof total.Total>[0]>(recipe, {
    axes: {
      tone: {
        across: "weight",
        draw: (props) => grounded(props.tone, <total.Total {...props} />),
      },
      truncate: {
        draw: (props) => (
          <Room size="xs">
            <path.Path {...props} />
          </Room>
        ),
        example: path,
      },
    },
    draw: (props) => <total.Total {...props} />,
    example: total,
    namespace: "span",
    order: ["tone", "truncate", "motion"],
  }),
  title: "span.title",
});
