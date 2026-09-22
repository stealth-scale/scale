/**
 * Shows the checkbox: every look at every size, every status in every look, every corner, the
 * states, the alignment against a long label, a settings row, and the motions.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The states scene is written by hand, because off, on, partly on and out of
 *   reach are two attributes a page sets on the element and the recipe declares no axis for either.
 *   Every box the recipe's own axes turn is drawn turned on, because a box that is off shows the
 *   look's ground and not its fill, and every box carries both marks, the tick and the dash, so
 *   the partly-on state has one to draw. The words are keys under `checkbox` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/checkbox.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import {
  Matrix,
  Room,
  type Scene,
  scenesOf,
  specimen,
  useWords,
  valuesOf,
  written,
} from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";
import { type CheckedState } from "#checkbox/machine.ts";
import { recipe } from "#checkbox/recipe.ts";

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
 * Every look the recipe draws, which the states are crossed with.
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
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Checkbox.Control>",
    "  <Checkbox.Indicator>{tick}</Checkbox.Indicator>",
    "</Checkbox.Control>",
    "<Checkbox.Label>Accept the terms</Checkbox.Label>",
  ].join("\n"),
  imports: 'import { Checkbox } from "@stealthscale/component-forms";',
  name: "Checkbox.Root",
};

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
 * Draws the box turned on, labelled for the thing it agrees to.
 */
function Accepted(props: Checkbox.RootProps): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Checkbox.Root defaultChecked {...props}>
      <Marks />
      <Checkbox.Label>{t("terms")}</Checkbox.Label>
    </Checkbox.Root>
  );
}

/**
 * Draws a settings row, which is what a spread row is read against.
 */
function Setting(props: Checkbox.RootProps): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Checkbox.Root {...props}>
      <Checkbox.Label>{t("weekly")}</Checkbox.Label>
      <Marks />
    </Checkbox.Root>
  );
}

/**
 * Draws the box against a label that runs to more than one line.
 *
 * @remarks
 *   The row stands in a room at the smallest measure, which is what makes the label wrap: given a
 *   cell of the catalogue it sat on one line, and the two places read the same.
 */
function Summary(props: Checkbox.RootProps): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Room size="xs">
      <Checkbox.Root {...props}>
        <Marks />
        <Checkbox.Label>{t("long")}</Checkbox.Label>
      </Checkbox.Root>
    </Room>
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
 * The hand-written scene for off, on, partly on and out of reach.
 */
export const states: Scene = {
  about: "checkbox.states.about",
  draw: States,
  source: written(SAMPLE, { defaultChecked: "indeterminate", disabled: true }),
  title: "checkbox.states.title",
};

export default specimen({
  about: "checkbox.about",
  id: "components/forms/checkbox",
  imports: 'import { Checkbox } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Checkbox.RootProps>(recipe, {
      axes: {
        align: { draw: (props) => <Summary {...props} /> },
        spread: { direction: "column", draw: (props) => <Setting {...props} /> },
        status: { across: "variant" },
        variant: { across: "size" },
      },
      draw: (props) => <Accepted {...props} />,
      namespace: "checkbox",
      order: ["variant", "status", "radius", "align", "spread", "motion"],
      sample: SAMPLE,
    }),
    states,
  ],
  title: "checkbox.title",
});
