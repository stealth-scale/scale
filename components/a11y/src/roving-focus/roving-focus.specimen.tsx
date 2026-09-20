/**
 * Shows the roving focus: a toolbar of three controls in every orientation, and one whose ends
 * join.
 *
 * @remarks
 *   The orientations are read off the recipe, so an orientation added to the theme reaches the
 *   page without this file changing. The ends are written out on a board instead, because a
 *   boolean prop is not an axis of the recipe and a board says where each of the two sits.
 *   Every toolbar stands in a box of its own. A set of controls carries no surface, so three sets
 *   loose on one card read as one ragged row of words rather than as three toolbars, and the
 *   vertical set stretched that row to the height of its tallest member.
 *   What the set does is only seen from the keyboard, so each scene says what to press. The words
 *   are keys under `roving-focus` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/roving-focus.json`.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import {
  Board,
  Matrix,
  Sample,
  type Scene,
  specimen,
  useWords,
  valuesOf,
} from "@stealthscale/specimen";

import { Item, Root } from "#roving-focus/index.ts";
import { recipe } from "#roving-focus/recipe.ts";

/**
 * The look every control of the toolbar takes, set once above them.
 */
const LOOK = { variant: "outline" } as const;

/**
 * Draws the three controls of an editing toolbar.
 */
function Controls(): ReactElement {
  const { t } = useWords("roving-focus");

  return (
    <ButtonPropsProvider value={LOOK}>
      <Item as={Button}>{t("cut")}</Item>
      <Item as={Button}>{t("copy")}</Item>
      <Item as={Button}>{t("paste")}</Item>
    </ButtonPropsProvider>
  );
}

/**
 * Draws one toolbar, named by whatever the page is showing.
 */
function Toolbar({ wrap = false, ...rest }: Parameters<typeof Root>[0]): ReactElement {
  const { t } = useWords("roving-focus");

  return (
    <Root aria-label={t("editing")} role="toolbar" wrap={wrap} {...rest}>
      <Controls />
    </Root>
  );
}

/**
 * Draws the toolbar in every orientation.
 */
function Orientations(): ReactElement {
  return (
    <Matrix knob="orientation" of={valuesOf(recipe, "orientation")}>
      {(orientation) => <Toolbar orientation={orientation} />}
    </Matrix>
  );
}

/**
 * Draws the toolbar with its ends apart beside one whose ends join.
 */
function Wrap(): ReactElement {
  return (
    <Board>
      <Sample knob="wrap" of="false">
        <Toolbar />
      </Sample>
      <Sample knob="wrap" of="true">
        <Toolbar wrap />
      </Sample>
    </Board>
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
