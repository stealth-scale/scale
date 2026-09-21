/**
 * Shows the text field: every look at every size, every status in every look, and the states a
 * page puts it in.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every field is named with `aria-label`, because a field with no name is
 *   announced as `edit text` and nothing more. The words are keys under `input` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/input.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Input } from "#input/input.ts";
import { recipe } from "#input/recipe.ts";

/**
 * The states a page puts a field in, beside the field as it is.
 */
const STATES = ["default", "disabled", "readOnly", "invalid"] as const;

/**
 * Every look the recipe draws.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Draws a search field in every look at every size.
 */
function Looks(): ReactElement {
  const { t } = useWords("input");

  return (
    <Matrix across={{ knob: "size", of: valuesOf(recipe, "size") }} knob="variant" of={LOOKS}>
      {(variant, size) => <Input aria-label={t("search")} size={size} variant={variant} />}
    </Matrix>
  );
}

/**
 * Draws an address field in every status in every look.
 */
function Statuses(): ReactElement {
  const { t } = useWords("input");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="status" of={valuesOf(recipe, "status")}>
      {(status, variant) => (
        <Input aria-label={t("email")} placeholder={t("email")} status={status} variant={variant} />
      )}
    </Matrix>
  );
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
 * Every look at every size.
 */
export const looks: Scene = {
  about: "input.looks.about",
  draw: Looks,
  title: "input.looks.title",
};

/**
 * Every status in every look.
 */
export const statuses: Scene = {
  about: "input.statuses.about",
  draw: Statuses,
  title: "input.statuses.title",
};

/**
 * Every state in every look.
 */
export const states: Scene = {
  about: "input.states.about",
  draw: States,
  title: "input.states.title",
};

export default specimen({
  about: "input.about",
  group: "Forms",
  id: "forms/input",
  imports: 'import { Input } from "@stealthscale/component-forms";',
  scenes: [looks, statuses, states],
  title: "input.title",
});
