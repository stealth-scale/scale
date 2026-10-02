/**
 * Catalogue page for the stack.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The direction and gap scenes render three
 *   buttons, and the alignment scene three buttons of different widths. The distribution scene
 *   renders a wizard's buttons in a 320px row, and the wrap scene an invoice row in a 320px room,
 *   where the text truncates without wrap and the button moves to the next line with it. Every
 *   scene renders a component from `examples/` and shows that file as its source. The words are
 *   keys under `stack` in `locales/en/specimen/stack.json`.
 */

import { Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as actions from "#stack/examples/actions.example.tsx";
import * as invoice from "#stack/examples/invoice.example.tsx";
import * as lengths from "#stack/examples/lengths.example.tsx";
import * as wizard from "#stack/examples/wizard.example.tsx";
import { recipe } from "#stack/recipe.ts";

export default specimen({
  about: "stack.about",
  id: "components/layout/stack",
  imports: 'import { Stack } from "@stealthscale/component-layout";',
  scenes: scenesOf<Parameters<typeof actions.Actions>[0]>(recipe, {
    axes: {
      align: { draw: (props) => <lengths.Lengths {...props} />, example: lengths },
      justify: {
        direction: "column",
        draw: (props) => (
          <Room size="xs">
            <wizard.Wizard {...props} />
          </Room>
        ),
        example: wizard,
      },
      wrap: {
        direction: "column",
        draw: (props) => (
          <Room size="xs">
            <invoice.Invoice {...props} />
          </Room>
        ),
        example: invoice,
      },
    },
    draw: (props) => <actions.Actions {...props} />,
    example: actions,
    namespace: "stack",
    order: ["direction", "gap", "align", "justify", "wrap"],
  }),
  title: "stack.title",
});
