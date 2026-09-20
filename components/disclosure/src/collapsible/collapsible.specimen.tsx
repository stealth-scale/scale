/**
 * Shows the collapsible: every look at every size open, every motion closed to be pressed, and a
 * block that leaves a preview showing.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The looks open by default so the block shows; the motions start closed,
 *   because a motion is only seen on the way open. The words are keys under `collapsible` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/collapsible.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Collapsible from "#collapsible/index.ts";
import { recipe } from "#collapsible/recipe.ts";

/**
 * The path of a chevron pointing down, in a 24 unit box.
 */
const CHEVRON = "m6 9 6 6 6-6";

/**
 * Draws the control and the block every collapsible holds.
 */
function Details(): ReactElement {
  const { t } = useWords("collapsible");

  return (
    <>
      <Collapsible.Trigger>
        {t("delivery")}
        <Collapsible.Indicator>
          <Icon viewBox="0 0 24 24">
            <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content>{t("arrives")}</Collapsible.Content>
    </>
  );
}

/**
 * Draws the collapsible open in every look at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => (
        <Collapsible.Root defaultOpen size={size} variant={variant}>
          <Details />
        </Collapsible.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the collapsible closed with every motion.
 */
function Motion(): ReactElement {
  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Collapsible.Root motion={motion} variant="outline">
          <Details />
        </Collapsible.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the collapsible closed with a line of the block showing.
 */
function Preview(): ReactElement {
  return (
    <Matrix knob="collapsedHeight" of={["2lh"]}>
      {(collapsedHeight) => (
        <Collapsible.Root collapsedHeight={collapsedHeight} variant="subtle">
          <Details />
        </Collapsible.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "collapsible.looks.about",
  draw: Looks,
  title: "collapsible.looks.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "collapsible.motion.about",
  draw: Motion,
  title: "collapsible.motion.title",
};

/**
 * A preview.
 */
export const preview: Scene = {
  about: "collapsible.preview.about",
  draw: Preview,
  title: "collapsible.preview.title",
};

export default specimen({
  about: "collapsible.about",
  group: "Disclosure",
  id: "disclosure/collapsible",
  scenes: [looks, motion, preview],
  title: "collapsible.title",
});
