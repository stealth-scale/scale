/**
 * Shows the roving focus: a toolbar of three controls in every orientation, and one whose ends
 * join.
 *
 * @remarks
 *   The orientations are read off the recipe, so an orientation added to the theme reaches the
 *   page without this file changing. The ends are written out on a board instead, because a
 *   boolean prop is not an axis of the recipe and a board says where each of the two sits.
 *   The controls sit in an attached `Group`, so three of them read as one toolbar rather than as
 *   three buttons that happen to be near each other. The group is drawn inside the root rather
 *   than as it: the root carries the role, the label and the arrows, and both of them state a
 *   direction, so one element bound to both recipes would take two rules for the same property.
 *   An item finds its place in the set through the root's context and not through the document,
 *   so the group between them changes nothing a keyboard does.
 *   What the set does is only seen from the keyboard, so each scene says what to press. The words
 *   are keys under `roving-focus` in the catalogue's namespace, kept beside this file in
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
 * The look every control of the toolbar takes, set once above them.
 */
const LOOK = { variant: "outline" } as const;

/**
 * Says which way the attached group runs for a set the arrows move through.
 *
 * @remarks
 *   A group runs one way or the other, and the arrows run on one axis or both. A set the arrows
 *   move through on both axes still reads along a row, because three controls reach no second
 *   line.
 */
function running(orientation: Orientation): "horizontal" | "vertical" {
  return orientation === "vertical" ? "vertical" : "horizontal";
}

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
  imports: 'import { RovingFocus } from "@stealthscale/component-a11y";',
  scenes: [orientations, wrap],
  title: "roving-focus.title",
});
