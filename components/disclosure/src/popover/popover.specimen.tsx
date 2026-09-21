/**
 * Shows the popover: every look at every size, and the panel on each side of its control.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every panel stays closed until its control is pressed, because a page of
 *   open panels would cover each other. The words are keys under `popover` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/popover.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Popover from "#popover/index.ts";
import { recipe } from "#popover/recipe.ts";

/**
 * The four sides a panel can open on.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * The path of a chevron pointing down, in a 24 unit box.
 */
const CHEVRON = "m6 9 6 6 6-6";

/**
 * The path of a cross, in a 24 unit box.
 */
const CROSS = "M6 6l12 12M18 6 6 18";

/**
 * Draws the control and the panel every popover holds.
 */
function Filters(): ReactElement {
  const { t } = useWords("popover");

  return (
    <>
      <Popover.Trigger>
        {t("filters")}
        <Popover.Indicator>
          <Icon viewBox="0 0 24 24">
            <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </Popover.Indicator>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Title>{t("filter")}</Popover.Title>
          <Popover.Description>{t("only")}</Popover.Description>
          <Popover.CloseTrigger aria-label={t("close")}>
            <Icon viewBox="0 0 24 24">
              <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="2" />
            </Icon>
          </Popover.CloseTrigger>
        </Popover.Content>
      </Popover.Positioner>
    </>
  );
}

/**
 * Draws the popover in every look at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => (
        <Popover.Root size={size} variant={variant}>
          <Filters />
        </Popover.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the popover opening on each side of its control.
 */
function Placement(): ReactElement {
  return (
    <Matrix knob="placement" of={SIDES}>
      {(placement) => (
        <Popover.Root positioning={{ placement }}>
          <Filters />
        </Popover.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "popover.looks.about",
  draw: Looks,
  title: "popover.looks.title",
};

/**
 * Each side of the control.
 */
export const placement: Scene = {
  about: "popover.placement.about",
  draw: Placement,
  title: "popover.placement.title",
};

export default specimen({
  about: "popover.about",
  group: "Disclosure",
  id: "disclosure/popover",
  imports: 'import { Popover } from "@stealthscale/component-disclosure";',
  scenes: [looks, placement],
  title: "popover.title",
});
