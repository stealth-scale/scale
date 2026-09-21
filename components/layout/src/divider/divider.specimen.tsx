/**
 * Shows the divider: a line across a column of things and a line down a row of them.
 *
 * @remarks
 *   The axis is read off the recipe, so an orientation added to the theme reaches the page
 *   without this file changing. Each line stands between two tiles in a stack running the other
 *   way, because a line between nothing shows nothing. The words are keys under `divider` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/divider.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Tile, useWords, valuesOf } from "@stealthscale/specimen";

import { Divider } from "#divider/divider.ts";
import { recipe } from "#divider/recipe.ts";
import { Stack } from "#stack/stack.ts";

/**
 * Draws yesterday and today with a line between them, in both orientations.
 */
function Orientations(): ReactElement {
  const { t } = useWords("divider");

  return (
    <Matrix knob="orientation" of={valuesOf(recipe, "orientation")}>
      {(orientation) => (
        <Stack align="stretch" direction={orientation === "vertical" ? "row" : "column"}>
          <Tile>{t("yesterday")}</Tile>
          <Divider
            aria-orientation={orientation === "vertical" ? "vertical" : undefined}
            orientation={orientation}
          />
          <Tile>{t("today")}</Tile>
        </Stack>
      )}
    </Matrix>
  );
}

/**
 * Both orientations.
 */
export const orientations: Scene = {
  about: "divider.orientations.about",
  draw: Orientations,
  title: "divider.orientations.title",
};

export default specimen({
  about: "divider.about",
  group: "Layout",
  id: "layout/divider",
  imports: 'import { Divider, Stack } from "@stealthscale/component-layout";',
  scenes: [orientations],
  title: "divider.title",
});
