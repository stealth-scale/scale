/**
 * Shows the container: every measure, and the gutter beside a flush edge.
 *
 * @remarks
 *   Every axis is read off the recipe, so a measure added to the theme reaches the page without
 *   this file changing. The cells run down the page, because a measure is only readable against
 *   the whole width of the column and a row of containers would give each a sliver. The content
 *   is a tile, so the measure the container holds it to can be read off the tile's width. The
 *   words are keys under `container` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/container.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Tile, useWords, valuesOf } from "@stealthscale/specimen";

import { Container } from "#container/container.ts";
import { recipe } from "#container/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws a line of text held to every measure.
 */
function Measures(): ReactElement {
  const { t } = useWords("container");

  return (
    <Matrix direction="column" knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <Container size={size}>
          <Tile>{t("prose")}</Tile>
        </Container>
      )}
    </Matrix>
  );
}

/**
 * Draws a page holding a container with its gutter, and one flush to the page's edges.
 */
function Gutter(): ReactElement {
  const { t } = useWords("container");

  return (
    <Matrix direction="column" knob="flush" of={EITHER}>
      {(flush) => (
        <Tile>
          {t("page")}
          <Container flush={flush} size="sm">
            <Tile>{t("settings")}</Tile>
          </Container>
        </Tile>
      )}
    </Matrix>
  );
}

/**
 * Every measure.
 */
export const measures: Scene = {
  about: "container.measures.about",
  draw: Measures,
  title: "container.measures.title",
};

/**
 * The gutter beside a flush edge.
 */
export const gutter: Scene = {
  about: "container.gutter.about",
  draw: Gutter,
  title: "container.gutter.title",
};

export default specimen({
  about: "container.about",
  group: "Layout",
  id: "layout/container",
  imports: 'import { Container } from "@stealthscale/component-layout";',
  scenes: [measures, gutter],
  title: "container.title",
});
