/**
 * Shows the switch: every look at every size, every status in every look, every corner, the
 * states, the alignment against a long label, and a settings row.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The words are keys under `switch` in the catalogue's namespace, kept
 *   beside this file in `locales/en/specimen/switch.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Switch from "#switch/index.ts";
import { recipe } from "#switch/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The states a switch can be in: off, on, and out of reach.
 */
const STATES = ["off", "on", "disabled"] as const;

/**
 * Every look the recipe draws.
 */
const LOOKS = valuesOf(recipe, "variant");

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
 * Draws the switch thrown on in every look at every size.
 */
function Looks(): ReactElement {
  const { t } = useWords("switch");

  return (
    <Matrix across={{ knob: "size", of: valuesOf(recipe, "size") }} knob="variant" of={LOOKS}>
      {(variant, size) => (
        <Switch.Root defaultChecked size={size} variant={variant}>
          <Switch.Label>{t("dark")}</Switch.Label>
          <Track />
        </Switch.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the switch thrown on in every status in every look.
 */
function Statuses(): ReactElement {
  const { t } = useWords("switch");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="status" of={valuesOf(recipe, "status")}>
      {(status, variant) => (
        <Switch.Root defaultChecked status={status} variant={variant}>
          <Switch.Label>{t("dark")}</Switch.Label>
          <Track />
        </Switch.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the switch thrown on at every corner.
 */
function Corners(): ReactElement {
  const { t } = useWords("switch");

  return (
    <Matrix knob="radius" of={valuesOf(recipe, "radius")}>
      {(radius) => (
        <Switch.Root defaultChecked radius={radius}>
          <Switch.Label>{t("dark")}</Switch.Label>
          <Track />
        </Switch.Root>
      )}
    </Matrix>
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
 * Draws the switch against a long label at both places.
 */
function Alignment(): ReactElement {
  const { t } = useWords("switch");

  return (
    <Matrix knob="align" of={valuesOf(recipe, "align")}>
      {(align) => (
        <Switch.Root align={align}>
          <Track />
          <Switch.Label>{t("long")}</Switch.Label>
        </Switch.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a row that takes what it needs beside a settings row.
 */
function Spread(): ReactElement {
  const { t } = useWords("switch");

  return (
    <Matrix direction="column" knob="spread" of={EITHER}>
      {(spread) => (
        <Switch.Root spread={spread}>
          <Switch.Label>{t("notifications")}</Switch.Label>
          <Track />
        </Switch.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "switch.looks.about",
  draw: Looks,
  title: "switch.looks.title",
};

/**
 * Every status in every look.
 */
export const statuses: Scene = {
  about: "switch.statuses.about",
  draw: Statuses,
  title: "switch.statuses.title",
};

/**
 * Every corner.
 */
export const corners: Scene = {
  about: "switch.corners.about",
  draw: Corners,
  title: "switch.corners.title",
};

/**
 * Every state in every look.
 */
export const states: Scene = {
  about: "switch.states.about",
  draw: States,
  title: "switch.states.title",
};

/**
 * Both places against a long label.
 */
export const alignment: Scene = {
  about: "switch.alignment.about",
  draw: Alignment,
  title: "switch.alignment.title",
};

/**
 * A row beside a settings row.
 */
export const spread: Scene = {
  about: "switch.spread.about",
  draw: Spread,
  title: "switch.spread.title",
};

export default specimen({
  about: "switch.about",
  group: "Forms",
  id: "forms/switch",
  scenes: [looks, statuses, corners, states, alignment, spread],
  title: "switch.title",
});
