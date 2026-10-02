/**
 * Catalogue page for the paragraph.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The tone scene crosses the weight axis and
 *   renders the inverted ink on `bg.inverted` through `grounded`. The alignment, truncation and
 *   mask scenes render a three-line release note in a 576px room, the width of a reading column.
 *   Every scene renders a component from `examples/` and shows that file as its source. The words
 *   are keys under `text` in `locales/en/specimen/text.json`.
 */

import { type ReactElement } from "react";

import { grounded, Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as payment from "#text/examples/payment.example.tsx";
import * as release from "#text/examples/release.example.tsx";
import * as session from "#text/examples/session.example.tsx";
import { recipe } from "#text/recipe.ts";

/**
 * Props of every Text example.
 */
type Props = Parameters<typeof session.Session>[0];

/**
 * Renders the release note in a 576px room.
 */
function columned(props: Props): ReactElement {
  return (
    <Room size="xl">
      <release.Release {...props} />
    </Room>
  );
}

export default specimen({
  about: "text.about",
  id: "components/typography/text",
  imports: 'import { Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<Props>(recipe, {
    axes: {
      align: { direction: "column", draw: columned, example: release },
      mask: { direction: "column", draw: columned, example: release },
      tone: {
        across: "weight",
        draw: (props) => grounded(props.tone, <payment.Payment {...props} />),
        example: payment,
      },
      truncate: { direction: "column", draw: columned, example: release },
    },
    draw: (props) => <session.Session {...props} />,
    example: session,
    namespace: "text",
    order: ["size", "tone", "align", "truncate", "motion", "mask"],
  }),
  title: "text.title",
});
