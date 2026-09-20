/**
 * Shows the tooltip: both looks at every size, and the box on each side of its control.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every box stays closed until a pointer rests on its control or the
 *   keyboard reaches it, because a page of open tooltips would cover each other. The words are
 *   keys under `tooltip` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/tooltip.json`.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Tooltip from "#tooltip/index.ts";
import { recipe } from "#tooltip/recipe.ts";

/**
 * The four sides a box can open on.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Draws the control and the box every tooltip holds.
 */
function Hint(): ReactElement {
  const { t } = useWords("tooltip");

  return (
    <>
      <Tooltip.Trigger as={Button}>{t("save")}</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>
          <Tooltip.Arrow>
            <Tooltip.ArrowTip />
          </Tooltip.Arrow>
          {t("saves")}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </>
  );
}

/**
 * Draws the tooltip in both looks at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => (
        <Tooltip.Root openDelay={100} size={size} variant={variant}>
          <Hint />
        </Tooltip.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the tooltip opening on each side of its control.
 */
function Placement(): ReactElement {
  return (
    <Matrix knob="placement" of={SIDES}>
      {(placement) => (
        <Tooltip.Root openDelay={100} positioning={{ placement }}>
          <Hint />
        </Tooltip.Root>
      )}
    </Matrix>
  );
}

/**
 * Both looks at every size.
 */
export const looks: Scene = {
  about: "tooltip.looks.about",
  draw: Looks,
  title: "tooltip.looks.title",
};

/**
 * Each side of the control.
 */
export const placement: Scene = {
  about: "tooltip.placement.about",
  draw: Placement,
  title: "tooltip.placement.title",
};

export default specimen({
  about: "tooltip.about",
  group: "Disclosure",
  id: "disclosure/tooltip",
  scenes: [looks, placement],
  title: "tooltip.title",
});
