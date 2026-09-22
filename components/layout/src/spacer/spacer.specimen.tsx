/**
 * Shows the spacer: a heading pushed to one end of a row and its action to the other.
 *
 * @remarks
 *   The recipe states no axis, so the page has nothing to generate a scene from and draws the one
 *   arrangement the component is for. The recipe's specification still asks what the page covers,
 *   so an axis added to the spacer fails that check until this page draws it. The words are keys
 *   under `spacer` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/spacer.json`.
 */

import { type ReactElement } from "react";

import { type Scene, specimen, Tile, useWords } from "@stealthscale/specimen";

import { Spacer } from "#spacer/spacer.ts";
import { Stack } from "#stack/stack.ts";

/**
 * Draws a heading, the room, and an action.
 */
function Room(): ReactElement {
  const { t } = useWords("spacer");

  return (
    <Stack direction="row">
      <Tile>{t("invoices")}</Tile>
      <Spacer />
      <Tile>{t("edit")}</Tile>
    </Stack>
  );
}

/**
 * The room between a heading and its action.
 */
export const room: Scene = {
  about: "spacer.room.about",
  draw: Room,
  title: "spacer.room.title",
};

export default specimen({
  about: "spacer.about",
  id: "components/layout/spacer",
  imports: 'import { Spacer, Stack } from "@stealthscale/component-layout";',
  scenes: [room],
  title: "spacer.title",
});
