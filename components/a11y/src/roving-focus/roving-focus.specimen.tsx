/**
 * Shows the roving focus: a toolbar of three controls in every orientation, and one whose ends
 * join.
 *
 * @remarks
 *   The axis is read off the recipe, so an orientation added to the theme reaches the page
 *   without this file changing. What the set does is only seen from the keyboard, so each scene
 *   says what to press. The words are keys under `roving-focus` in the catalogue's namespace, kept
 *   beside this file in `locales/en/specimen/roving-focus.json`.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Item, Root } from "#roving-focus/index.ts";
import { recipe } from "#roving-focus/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The look every control of the toolbar takes, set once above them.
 */
const GHOST = { variant: "ghost" } as const;

/**
 * Draws the three controls of an editing toolbar.
 */
function Controls(): ReactElement {
  const { t } = useWords("roving-focus");

  return (
    <ButtonPropsProvider value={GHOST}>
      <Item as={Button}>{t("cut")}</Item>
      <Item as={Button}>{t("copy")}</Item>
      <Item as={Button}>{t("paste")}</Item>
    </ButtonPropsProvider>
  );
}

/**
 * Draws the toolbar in every orientation.
 */
function Orientations(): ReactElement {
  const { t } = useWords("roving-focus");

  return (
    <Matrix knob="orientation" of={valuesOf(recipe, "orientation")}>
      {(orientation) => (
        <Root aria-label={t("editing")} orientation={orientation} role="toolbar">
          <Controls />
        </Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the toolbar with its ends apart and joined.
 */
function Wrap(): ReactElement {
  const { t } = useWords("roving-focus");

  return (
    <Matrix knob="wrap" of={EITHER}>
      {(wrap) => (
        <Root aria-label={t("editing")} role="toolbar" wrap={wrap}>
          <Controls />
        </Root>
      )}
    </Matrix>
  );
}

/**
 * Every orientation.
 */
export const orientations: Scene = {
  about: "roving-focus.orientations.about",
  draw: Orientations,
  title: "roving-focus.orientations.title",
};

/**
 * The ends apart beside the ends joined.
 */
export const wrap: Scene = {
  about: "roving-focus.wrap.about",
  draw: Wrap,
  title: "roving-focus.wrap.title",
};

export default specimen({
  about: "roving-focus.about",
  group: "Accessibility",
  id: "a11y/roving-focus",
  scenes: [orientations, wrap],
  title: "roving-focus.title",
});
