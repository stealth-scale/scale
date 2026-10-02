/**
 * Catalogue page for the textarea.
 *
 * @remarks
 *   `scenesOf` generates the sizes scene and the statuses scene, each crossed with the looks, and
 *   the grip and grows scenes. The states scene is hand-written, because focus, `disabled`,
 *   `readOnly` and `aria-invalid` are element states, not recipe axes. Its focused row renders each
 *   look inside `Focused`. The grows scene renders more lines of text than the field's three rows,
 *   so the fixed field scrolls and the growing field takes the height of the text. The row limit
 *   scene is hand-written, because `maxRows` is a prop, not a recipe axis: the same text at a limit
 *   of 3 and of 5, so one field stops and the other grows further. Every scene renders a component
 *   from `examples/` and shows that file as its source. The words are keys under `textarea` in
 *   `locales/en/specimen/textarea.json`.
 */

import { Focused, Matrix, type Scene, scenesOf, specimen, valuesOf } from "@stealthscale/specimen";

import * as capped from "#textarea/examples/capped.example.tsx";
import * as delivery from "#textarea/examples/delivery.example.tsx";
import * as notes from "#textarea/examples/notes.example.tsx";
import * as reply from "#textarea/examples/reply.example.tsx";
import { recipe } from "#textarea/recipe.ts";

/**
 * Look values, crossed with the sizes, the statuses and the states.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * States of the states scene, in reading order.
 */
const STATES = ["rest", "focused", "disabled", "readOnly", "invalid"] as const;

/**
 * Maps each state to the props that put a field in it. `Focused` stages the focused state.
 */
const STATED: Readonly<Record<(typeof STATES)[number], Parameters<typeof reply.Reply>[0]>> = {
  disabled: { disabled: true },
  focused: {},
  invalid: { "aria-invalid": true },
  readOnly: { readOnly: true },
  rest: {},
};

/**
 * Row limits of the row limit scene: one under the text's line count and one over it.
 */
const LIMITS = [3, 5] as const;

/**
 * Hand-written scene for a growing field that stops at its row limit, beside one that grows
 * further.
 */
export const limit: Scene = {
  about: "textarea.limit.about",
  draw: () => (
    <Matrix knob="maxRows" of={LIMITS}>
      {(maxRows) => <capped.Capped maxRows={maxRows} />}
    </Matrix>
  ),
  example: capped,
  props: { maxRows: 3 },
  title: "textarea.limit.title",
};

/**
 * Hand-written scene for the focus, disabled, read-only and invalid states on every look.
 */
export const states: Scene = {
  about: "textarea.states.about",
  draw: () => (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="state" of={STATES}>
      {(state, variant) =>
        state === "focused" ? (
          <Focused>
            <reply.Reply variant={variant} />
          </Focused>
        ) : (
          <reply.Reply {...STATED[state]} variant={variant} />
        )
      }
    </Matrix>
  ),
  example: reply,
  props: { readOnly: true, variant: "outline" },
  title: "textarea.states.title",
};

export default specimen({
  about: "textarea.about",
  id: "components/forms/textarea",
  imports: 'import { Textarea } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Parameters<typeof notes.Notes>[0]>(recipe, {
      axes: {
        grows: { draw: (props) => <delivery.Delivery {...props} />, example: delivery },
        size: { across: "variant" },
        status: { across: "variant" },
      },
      draw: (props) => <notes.Notes {...props} />,
      example: notes,
      namespace: "textarea",
      order: ["size", "status", "grip", "grows"],
    }),
    limit,
    states,
  ],
  title: "textarea.title",
});
