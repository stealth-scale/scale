/**
 * Shows the text field: every look at every size, every status in every look, and the states a
 * page puts it in.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The states scene is written by hand, because a page sets those three as
 *   attributes on the element and the recipe declares no axis for them.
 *   Every field is named with `aria-label`, because a field with no name is announced as `edit
 *   text` and nothing more. The words are keys under `input` in the catalogue's namespace, kept
 *   beside this file in `locales/en/specimen/input.json`.
 */

import { type ReactElement } from "react";

import {
  Matrix,
  type Scene,
  scenesOf,
  specimen,
  useWords,
  valuesOf,
  written,
} from "@stealthscale/specimen";

import { Input, type InputProps } from "#input/input.ts";
import { recipe } from "#input/recipe.ts";

/**
 * The states a page puts a field in, beside the field as it is.
 */
const STATES = ["default", "disabled", "readOnly", "invalid"] as const;

/**
 * Every look the recipe draws, which the states are crossed with.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  imports: 'import { Input } from "@stealthscale/component-forms";',
  name: "Input",
};

/**
 * Draws a search field, which is what a look and a size are read against.
 */
function Search(props: InputProps): ReactElement {
  const { t } = useWords("input");

  return <Input aria-label={t("search")} {...props} />;
}

/**
 * Draws an address field, which is what a status is read against.
 */
function Address(props: InputProps): ReactElement {
  const { t } = useWords("input");

  return <Input aria-label={t("email")} placeholder={t("email")} {...props} />;
}

/**
 * Draws an address field in every state, in every look.
 */
function States(): ReactElement {
  const { t } = useWords("input");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="state" of={STATES}>
      {(state, variant) => (
        <Input
          aria-invalid={state === "invalid" ? true : undefined}
          aria-label={t("email")}
          defaultValue={t("email")}
          disabled={state === "disabled"}
          readOnly={state === "readOnly"}
          variant={variant}
        />
      )}
    </Matrix>
  );
}

/**
 * The hand-written scene for the states a page puts a field in.
 */
export const states: Scene = {
  about: "input.states.about",
  draw: States,
  source: written(SAMPLE, { disabled: true, variant: "outline" }),
  title: "input.states.title",
};

export default specimen({
  about: "input.about",
  id: "components/forms/input",
  imports: 'import { Input } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<InputProps>(recipe, {
      axes: {
        status: { across: "variant", draw: (props) => <Address {...props} /> },
        variant: { across: "size" },
      },
      draw: (props) => <Search {...props} />,
      namespace: "input",
      order: ["variant", "status"],
      sample: SAMPLE,
    }),
    states,
  ],
  title: "input.title",
});
