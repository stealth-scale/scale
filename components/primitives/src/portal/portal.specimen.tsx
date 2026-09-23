/**
 * Catalogue page for the portal.
 *
 * @remarks
 *   The portal has no recipe, so the page has one hand-written scene. The scene renders a card
 *   written once after two panels, and three controls that move the card into either panel or
 *   back to where it is written. Each panel renders an empty element as the portal's container,
 *   so the card is that element's only child. The scene renders a component from `examples/` and
 *   shows that file as its source. The words are keys under `portal` in
 *   `locales/en/specimen/portal.json`.
 */

import { type ReactElement } from "react";

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as placing from "#portal/examples/placing.example.tsx";

/**
 * Renders the placing demo in a 512px room.
 */
function Placing(): ReactElement {
  return (
    <Room size="lg">
      <placing.Placing />
    </Room>
  );
}

/**
 * Hand-written scene that moves one card between two panels and the place it is written.
 */
export const scene: Scene = {
  about: "portal.placing.about",
  draw: Placing,
  example: placing,
  title: "portal.placing.title",
};

export default specimen({
  about: "portal.about",
  id: "components/primitives/portal",
  imports: 'import { Portal } from "@stealthscale/component-primitives";',
  scenes: [scene],
  title: "portal.title",
});
