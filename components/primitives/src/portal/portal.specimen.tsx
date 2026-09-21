/**
 * Shows the portal: a tile sent into a panel beside where it is written, and one left in place.
 *
 * @remarks
 *   The portal has no axis, so the scene draws the pair once rather than a matrix. The panel is a
 *   tile held in state, because a portal needs the element it draws into and an element exists
 *   only once it has mounted. The words are keys under `portal` in the catalogue's namespace, kept
 *   beside this file in `locales/en/specimen/portal.json`.
 */

import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { type Scene, specimen, Tile, useWords } from "@stealthscale/specimen";

import { Portal } from "#portal/portal.ts";

/**
 * Draws a panel, a tile sent into it, and a tile left where it is written.
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
 * A tile sent into a panel beside one left in place.
 */
export const placing: Scene = {
  about: "portal.placing.about",
  draw: Placing,
  title: "portal.placing.title",
};

export default specimen({
  about: "portal.about",
  group: "Primitives",
  id: "primitives/portal",
  imports: 'import { Portal } from "@stealthscale/component-primitives";',
  scenes: [placing],
  title: "portal.title",
});
