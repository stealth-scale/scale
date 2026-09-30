/**
 * Catalogue page for the color mode toggle.
 *
 * @remarks
 *   The toggle has no recipe of its own: it renders the button and the swap, so every scene is
 *   hand-written. Each toggle switches the catalogue's own color mode, because the catalogue
 *   renders inside a color mode provider. The header scene shows the toggle at the end of an
 *   application's header, and the looks scene turns the button's `variant`. The words are keys
 *   under `color-mode-toggle` in `locales/en/specimen/color-mode-toggle.json`.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/specimen";

import * as header from "#color-mode-toggle/examples/header.example.tsx";
import * as looks from "#color-mode-toggle/examples/looks.example.tsx";
import type * as Toggle from "#color-mode-toggle/index.ts";

/**
 * Looks of the looks scene: the button's looks for a control in a bar, in reading order.
 */
const LOOKS: ReadonlyArray<NonNullable<Toggle.ColorModeToggleProps["variant"]>> = [
  "ghost",
  "outline",
  "subtle",
  "surface",
];

/**
 * Hand-written scene for the toggle at the end of a header.
 */
export const headed: Scene = {
  about: "color-mode-toggle.header.about",
  draw: header.Header,
  example: header,
  title: "color-mode-toggle.header.title",
};

/**
 * Hand-written scene for the looks a toggle takes from the button.
 */
export const looked: Scene = {
  about: "color-mode-toggle.looks.about",
  draw: () => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => <looks.Looks variant={variant} />}
    </Matrix>
  ),
  example: looks,
  props: { variant: "ghost" },
  title: "color-mode-toggle.looks.title",
};

export default specimen({
  about: "color-mode-toggle.about",
  id: "components/actions/color-mode-toggle",
  imports: 'import { ColorModeToggle } from "@stealthscale/component-actions";',
  scenes: [headed, looked],
  title: "color-mode-toggle.title",
});
