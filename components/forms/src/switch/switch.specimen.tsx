/**
 * Shows the switch: every look at every size, every status in every look, every corner, the
 * states, the alignment against a long label, and a settings row.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The states scene is written by hand, because off, on and out of reach are
 *   two attributes a page sets on the element and the recipe declares no axis for either.
 *   Every switch the recipe's own axes turn is drawn thrown on, because a track that is off shows
 *   the look's ground and not its fill. The words are keys under `switch` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/switch.json`.
 */

import { type ReactElement } from "react";

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

import * as Switch from "#switch/index.ts";
import { recipe } from "#switch/recipe.ts";

/**
 * The states a switch can be in: off, on, and out of reach.
 */
const STATES = ["off", "on", "disabled"] as const;

/**
 * Every look the recipe draws, which the states are crossed with.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Switch.Label>Dark mode</Switch.Label>",
    "<Switch.Control>",
    "  <Switch.Thumb />",
    "</Switch.Control>",
  ].join("\n"),
  imports: 'import { Switch } from "@stealthscale/component-forms";',
  name: "Switch.Root",
};

/**
 * Draws the track with its thumb.
 */
function Track(): ReactElement {
  return (
    <Switch.Control>
      <Switch.Thumb />
    </Switch.Control>
  );
}

/**
 * Draws the switch thrown on, labelled for the setting it stands for.
 */
function Thrown(props: Switch.RootProps): ReactElement {
  const { t } = useWords("switch");

  return (
    <Switch.Root defaultChecked {...props}>
      <Switch.Label>{t("dark")}</Switch.Label>
      <Track />
    </Switch.Root>
  );
}

/**
 * Draws a settings row, which is what a spread row is read against.
 */
function Setting(props: Switch.RootProps): ReactElement {
  const { t } = useWords("switch");

  return (
    <Switch.Root {...props}>
      <Switch.Label>{t("notifications")}</Switch.Label>
      <Track />
    </Switch.Root>
  );
}

/**
 * Draws the switch against a label that runs to more than one line.
 *
 * @remarks
 *   The row stands in a room at the smallest measure, which is what makes the label wrap: given a
 *   cell of the catalogue it sat on one line, and the two places read the same.
 */
function Signed(props: Switch.RootProps): ReactElement {
  const { t } = useWords("switch");

  return (
    <Room size="xs">
      <Switch.Root {...props}>
        <Track />
        <Switch.Label>{t("long")}</Switch.Label>
      </Switch.Root>
    </Room>
  );
}

/**
 * Draws the switch in every state in every look.
 */
function States(): ReactElement {
  const { t } = useWords("switch");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="state" of={STATES}>
      {(state, variant) => (
        <Switch.Root
          defaultChecked={state !== "off"}
          disabled={state === "disabled"}
          variant={variant}
        >
          <Switch.Label>{t("notifications")}</Switch.Label>
          <Track />
        </Switch.Root>
      )}
    </Matrix>
  );
}

/**
 * The hand-written scene for off, on and out of reach.
 */
export const states: Scene = {
  about: "switch.states.about",
  draw: States,
  source: written(SAMPLE, { defaultChecked: true, disabled: true }),
  title: "switch.states.title",
};

export default specimen({
  about: "switch.about",
  id: "components/forms/switch",
  imports: 'import { Switch } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Switch.RootProps>(recipe, {
      axes: {
        align: { draw: (props) => <Signed {...props} /> },
        spread: { direction: "column", draw: (props) => <Setting {...props} /> },
        status: { across: "variant" },
        variant: { across: "size" },
      },
      draw: (props) => <Thrown {...props} />,
      namespace: "switch",
      order: ["variant", "status", "radius", "align", "spread"],
      sample: SAMPLE,
    }),
    states,
  ],
  title: "switch.title",
});
