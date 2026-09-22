/**
 * Shows the divider: a line across a column of things and a line down a row of them.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an orientation added to the theme reaches the page
 *   without this file changing. Each line stands between two tiles in a stack running the other
 *   way, because a line between nothing shows nothing. The words are keys under `divider` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/divider.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, Tile, useWords } from "@stealthscale/specimen";

import { Divider, type DividerProps } from "#divider/divider.ts";
import { recipe } from "#divider/recipe.ts";
import { Stack } from "#stack/stack.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  imports: 'import { Divider } from "@stealthscale/component-layout";',
  name: "Divider",
};

/**
 * Draws yesterday and today with a line between them, in a stack running the other way.
 *
 * @remarks
 *   A line standing up states its orientation beside its look, because a browser assumes a
 *   separator lies flat. The stack runs the way the line does not, so the line parts the two tiles
 *   rather than lying along one of them.
 */
function Between({ orientation, ...rest }: DividerProps): ReactElement {
  const { t } = useWords("divider");
  const standing = orientation === "vertical";

  return (
    <Stack align="stretch" direction={standing ? "row" : "column"}>
      <Tile>{t("yesterday")}</Tile>
      <Divider
        {...(standing ? { "aria-orientation": "vertical" as const } : {})}
        {...(orientation === undefined ? {} : { orientation })}
        {...rest}
      />
      <Tile>{t("today")}</Tile>
    </Stack>
  );
}

export default specimen({
  about: "divider.about",
  id: "components/layout/divider",
  imports: 'import { Divider, Stack } from "@stealthscale/component-layout";',
  scenes: scenesOf<DividerProps>(recipe, {
    draw: (props) => <Between {...props} />,
    namespace: "divider",
    sample: SAMPLE,
  }),
  title: "divider.title",
});
