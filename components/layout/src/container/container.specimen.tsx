/**
 * Shows the container: every measure, and the gutter beside a flush edge.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a measure added to the theme reaches the page
 *   without this file changing. The cells run down the page, because a measure is only readable
 *   against the whole width of the column and a row of containers would give each a sliver. The
 *   content is a tile, so the measure the container holds it to can be read off the tile's width.
 *   The words are keys under `container` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/container.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, Tile, useWords } from "@stealthscale/specimen";

import { Container, type ContainerProps } from "#container/container.ts";
import { recipe } from "#container/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "<p>Running text at the measure it is read at.</p>",
  imports: 'import { Container } from "@stealthscale/component-layout";',
  name: "Container",
};

/**
 * Draws a line of text held to whatever measure the scene hands over.
 */
function Measured(props: ContainerProps): ReactElement {
  const { t } = useWords("container");

  return (
    <Container {...props}>
      <Tile>{t("prose")}</Tile>
    </Container>
  );
}

/**
 * Draws a page holding a container, so the gutter is the room between the page and the content.
 *
 * @remarks
 *   The gutter is only visible against something the container sits inside, so the outer tile
 *   stands for the page. A flush container takes the gutter away and its content meets that edge.
 */
function Gutter(props: ContainerProps): ReactElement {
  const { t } = useWords("container");

  return (
    <Tile>
      {t("page")}
      <Container {...props}>
        <Tile>{t("settings")}</Tile>
      </Container>
    </Tile>
  );
}

export default specimen({
  about: "container.about",
  id: "components/layout/container",
  imports: 'import { Container } from "@stealthscale/component-layout";',
  scenes: scenesOf<ContainerProps>(recipe, {
    axes: {
      flush: {
        direction: "column",
        draw: (props) => <Gutter {...props} />,
        with: { size: "sm" },
      },
      size: { direction: "column" },
    },
    draw: (props) => <Measured {...props} />,
    namespace: "container",
    order: ["size", "flush"],
    sample: SAMPLE,
  }),
  title: "container.title",
});
