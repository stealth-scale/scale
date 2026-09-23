/**
 * Catalogue page for the input.
 *
 * @remarks
 *   `scenesOf` generates the sizes scene and the statuses scene, each crossed with the looks. The
 *   states scene is hand-written, because focus, `disabled`, `readOnly` and `aria-invalid` are
 *   element states, not recipe axes. Its focused row renders each look inside `Focused`, which
 *   marks the field as focused by keyboard. Every scene renders a component from `examples/` and
 *   shows that file as its source. The words are keys under `input` in
 *   `locales/en/specimen/input.json`.
 */

import { Focused, Matrix, type Scene, scenesOf, specimen, valuesOf } from "@stealthscale/specimen";

import * as email from "#input/examples/email.example.tsx";
import * as reference from "#input/examples/reference.example.tsx";
import * as search from "#input/examples/search.example.tsx";
import { recipe } from "#input/recipe.ts";

/**
 * Look values, crossed with every other axis.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * States of the states scene, in reading order.
 */
const STATES = ["rest", "focused", "disabled", "readOnly", "invalid"] as const;

/**
 * Maps each state to the props that put a field in it. `Focused` stages the focused state.
 */
const STATED: Readonly<Record<(typeof STATES)[number], Parameters<typeof reference.Reference>[0]>> =
  {
    disabled: { disabled: true },
    focused: {},
    invalid: { "aria-invalid": true },
    readOnly: { readOnly: true },
    rest: {},
  };

/**
 * Hand-written scene for the focus, disabled, read-only and invalid states on every look.
 */
export const states: Scene = {
  about: "input.states.about",
  draw: () => (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="state" of={STATES}>
      {(state, variant) =>
        state === "focused" ? (
          <Focused>
            <reference.Reference variant={variant} />
          </Focused>
        ) : (
          <reference.Reference {...STATED[state]} variant={variant} />
        )
      }
    </Matrix>
  ),
  example: reference,
  props: { "aria-invalid": true, variant: "outline" },
  title: "input.states.title",
};

export default specimen({
  about: "input.about",
  id: "components/forms/input",
  imports: 'import { Input } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Parameters<typeof search.Search>[0]>(recipe, {
      axes: {
        size: { across: "variant" },
        status: {
          across: "variant",
          draw: (props) => <email.Email {...props} />,
          example: email,
        },
      },
      draw: (props) => <search.Search {...props} />,
      example: search,
      namespace: "input",
      order: ["size", "status"],
    }),
    states,
  ],
  title: "input.title",
});
