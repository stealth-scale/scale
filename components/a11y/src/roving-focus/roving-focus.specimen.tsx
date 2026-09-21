/**
 * Catalogue entry for the roving focus group, showing a three-button toolbar in each orientation
 * and with wrapping on and off.
 *
 * @remarks
 *   The orientation values come from the recipe, so a value added to the theme appears on the page
 *   without an edit here. Wrapping is laid out on a board instead, because it is a boolean prop
 *   rather than a recipe variant and the board labels each of the two cells. The buttons sit in an
 *   attached `Group` so the three read as one toolbar. The group is nested inside the root rather
 *   than being the root, because both recipes set a flex direction and binding one element to both
 *   would leave two rules competing for the same property; items locate themselves through the
 *   root's context rather than the DOM tree, so the extra element changes nothing about keyboard
 *   behaviour. The behaviour is only visible from the keyboard, so each scene names the keys to
 *   press. Copy comes from the `roving-focus` namespace in
 *   `locales/en/specimen/roving-focus.json`.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Group } from "@stealthscale/component-layout";
import {
  Board,
  Matrix,
  Sample,
  type Scene,
  specimen,
  useWords,
  valuesOf,
} from "@stealthscale/specimen";

import { Item, type Orientation, Root, type RootProps } from "#roving-focus/index.ts";
import { recipe } from "#roving-focus/recipe.ts";

/**
 * Button props supplied once from above, so every control in the toolbar shares a variant.
 */
const LOOK = { variant: "outline" } as const;

/**
 * Narrows a group orientation to the two values the attached `Group` accepts.
 *
 * @remarks
 *   `Group` has no equivalent of `both`, and three buttons never reach a second line anyway, so
 *   `both` is rendered as a row.
 */
function running(orientation: Orientation): "horizontal" | "vertical" {
  return orientation === "vertical" ? "vertical" : "horizontal";
}

/**
 * Renders cut, copy and paste as three items of the group.
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
 * Renders a labelled toolbar at a given orientation and wrapping setting.
 */
function Toolbar({
  orientation = "horizontal",
  wrap = false,
}: Pick<RootProps, "orientation" | "wrap">): ReactElement {
  const { t } = useWords("roving-focus");

  return (
    <Root aria-label={t("editing")} orientation={orientation} role="toolbar" wrap={wrap}>
      <Group attached orientation={running(orientation)}>
        <Controls />
      </Group>
    </Root>
  );
}

/**
 * Renders one toolbar per orientation the recipe declares.
 */
function Orientations(): ReactElement {
  return (
    <Matrix knob="orientation" of={valuesOf(recipe, "orientation")}>
      {(orientation) => <Toolbar orientation={orientation} />}
    </Matrix>
  );
}

/**
 * Renders the toolbar twice, once with wrapping off and once with it on.
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
 * Scene covering each orientation of the group.
 */
export const orientations: Scene = {
  about: "roving-focus.orientations.about",
  draw: Orientations,
  title: "roving-focus.orientations.title",
};

/**
 * Scene contrasting a group that stops at its ends with one that wraps.
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
  imports: 'import { RovingFocus } from "@stealthscale/component-a11y";',
  scenes: [orientations, wrap],
  title: "roving-focus.title",
});
