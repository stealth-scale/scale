/**
 * Lays out the catalogue page for the portal.
 *
 * @remarks
 *   The portal ships no recipe at all: it moves nodes and draws nothing. There is no axis to
 *   generate a scene from and no recipe specification to ask what this page covers, so the one
 *   scene is written by hand and stays that way. The
 *   destination is a tile kept in state, because a portal needs a real element and an element only
 *   exists once it has mounted. The text comes from keys under `portal` in the catalogue
 *   namespace, held beside this file in `locales/en/specimen/portal.json`.
 */

import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { type Scene, specimen, Tile, useWords } from "@stealthscale/specimen";

import { Portal } from "#portal/portal.ts";

/**
 * Renders a destination tile, one tile portalled into it, and one tile left where it was written.
 */
function Placing(): ReactElement {
  const { t } = useWords("portal");
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);

  return (
    <Stack direction="row">
      <Tile ref={setPanel}>
        {t("target")}
        <Portal container={panel}>
          <Tile>{t("sent")}</Tile>
        </Portal>
      </Tile>
      <Portal disabled>
        <Tile>{t("here")}</Tile>
      </Portal>
    </Stack>
  );
}

/**
 * The scene contrasting a portalled tile with a disabled one.
 */
export const placing: Scene = {
  about: "portal.placing.about",
  draw: Placing,
  title: "portal.placing.title",
};

export default specimen({
  about: "portal.about",
  id: "components/primitives/portal",
  imports: 'import { Portal } from "@stealthscale/component-primitives";',
  scenes: [placing],
  title: "portal.title",
});
