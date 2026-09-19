/**
 * Shows the checkbox: every look at every size, every status in every look, every corner, the
 * states, the alignment against a long label, a settings row, and the motions.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every box carries both marks, the tick and the dash, so the partly-on
 *   state has one to draw. The words are keys under `checkbox` in the catalogue's namespace, kept
 *   beside this file in `locales/en/specimen/checkbox.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";
import { type CheckedState } from "#checkbox/machine.ts";
import { recipe } from "#checkbox/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The states a box can be in: off, on, partly on, and out of reach.
 */
const STATES = ["off", "on", "mixed", "disabled"] as const;

/**
 * What each state sets on the root.
 */
const CHECKED: Record<(typeof STATES)[number], CheckedState> = {
  disabled: true,
  mixed: "indeterminate",
  off: false,
  on: true,
};

/**
 * Every look the recipe draws.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * The path of a tick, in a 24 unit box.
 */
const TICK = "M20 6 9 17l-5-5";

/**
 * The path of a dash, in a 24 unit box.
 */
const DASH = "M5 12h14";

/**
 * Draws the box with both its marks.
 */
function Marks(): ReactElement {
  return (
    <Checkbox.Control>
      <Checkbox.Indicator>
        <Icon viewBox="0 0 24 24">
          <path d={TICK} fill="none" stroke="currentColor" strokeWidth="3" />
        </Icon>
      </Checkbox.Indicator>
      <Checkbox.Indicator indeterminate>
        <Icon viewBox="0 0 24 24">
          <path d={DASH} fill="none" stroke="currentColor" strokeWidth="3" />
        </Icon>
      </Checkbox.Indicator>
    </Checkbox.Control>
  );
}

/**
 * Draws the box turned on in every look at every size.
 */
function Looks(): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Matrix across={{ knob: "size", of: valuesOf(recipe, "size") }} knob="variant" of={LOOKS}>
      {(variant, size) => (
        <Checkbox.Root defaultChecked size={size} variant={variant}>
          <Marks />
          <Checkbox.Label>{t("terms")}</Checkbox.Label>
        </Checkbox.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the box turned on in every status in every look.
 */
function Statuses(): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="status" of={valuesOf(recipe, "status")}>
      {(status, variant) => (
        <Checkbox.Root defaultChecked status={status} variant={variant}>
          <Marks />
          <Checkbox.Label>{t("terms")}</Checkbox.Label>
        </Checkbox.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the box turned on at every corner.
 */
function Corners(): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Matrix knob="radius" of={valuesOf(recipe, "radius")}>
      {(radius) => (
        <Checkbox.Root defaultChecked radius={radius}>
          <Marks />
          <Checkbox.Label>{t("terms")}</Checkbox.Label>
        </Checkbox.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the box in every state in every look.
 */
function States(): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="state" of={STATES}>
      {(state, variant) => (
        <Checkbox.Root
          defaultChecked={CHECKED[state]}
          disabled={state === "disabled"}
          variant={variant}
        >
          <Marks />
          <Checkbox.Label>{t("weekly")}</Checkbox.Label>
        </Checkbox.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the box against a long label at both places.
 */
function Alignment(): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Matrix knob="align" of={valuesOf(recipe, "align")}>
      {(align) => (
        <Checkbox.Root align={align}>
          <Marks />
          <Checkbox.Label>{t("long")}</Checkbox.Label>
        </Checkbox.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a row that takes what it needs beside a settings row.
 */
function Spread(): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Matrix direction="column" knob="spread" of={EITHER}>
      {(spread) => (
        <Checkbox.Root spread={spread}>
          <Checkbox.Label>{t("weekly")}</Checkbox.Label>
          <Marks />
        </Checkbox.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the row entering with every motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Checkbox.Root defaultChecked motion={motion}>
          <Marks />
          <Checkbox.Label>{t("terms")}</Checkbox.Label>
        </Checkbox.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "checkbox.looks.about",
  draw: Looks,
  title: "checkbox.looks.title",
};

/**
 * Every status in every look.
 */
export const statuses: Scene = {
  about: "checkbox.statuses.about",
  draw: Statuses,
  title: "checkbox.statuses.title",
};

/**
 * Every corner.
 */
export const corners: Scene = {
  about: "checkbox.corners.about",
  draw: Corners,
  title: "checkbox.corners.title",
};

/**
 * Every state in every look.
 */
export const states: Scene = {
  about: "checkbox.states.about",
  draw: States,
  title: "checkbox.states.title",
};

/**
 * Both places against a long label.
 */
export const alignment: Scene = {
  about: "checkbox.alignment.about",
  draw: Alignment,
  title: "checkbox.alignment.title",
};

/**
 * A row beside a settings row.
 */
export const spread: Scene = {
  about: "checkbox.spread.about",
  draw: Spread,
  title: "checkbox.spread.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "checkbox.motion.about",
  draw: Motion,
  title: "checkbox.motion.title",
};

export default specimen({
  about: "checkbox.about",
  group: "Forms",
  id: "forms/checkbox",
  scenes: [looks, statuses, corners, states, alignment, spread, motion],
  title: "checkbox.title",
});
