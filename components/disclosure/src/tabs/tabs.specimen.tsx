/**
 * Catalogue page for the tabs.
 *
 * @remarks
 *   `scenesOf` generates the looks, palettes, sizes, fitted tabs and distributions from the account
 *   example. The fitted scene uses the enclosed look, where each tab's width shows. The orientation
 *   scene is hand-written, because the orientation is the machine's option and not an axis. Every
 *   set renders in an `md` room, open on its first panel, and every scene shows the account
 *   example as its source. The words are keys under `tabs` in `locales/en/specimen/tabs.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#tabs/examples/index.ts";
import type * as Tabs from "#tabs/index.ts";
import { recipe } from "#tabs/recipe.ts";

/**
 * Orientations of the orientation scene.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

/**
 * Hand-written scene for both orientations.
 */
export const orientation: Scene = {
  about: "tabs.orientation.about",
  draw: () => (
    <Matrix knob="orientation" of={ORIENTATIONS}>
      {(way) => (
        <Room size="md">
          <examples.account.Account orientation={way} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.account,
  props: { orientation: "horizontal" },
  title: "tabs.orientation.title",
};

export default specimen({
  about: "tabs.about",
  id: "components/disclosure/tabs",
  imports: 'import { Tabs } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Tabs.RootProps>(recipe, {
      axes: {
        fitted: { direction: "column", with: { variant: "enclosed" } },
        justify: { direction: "column" },
        size: { direction: "column" },
        variant: { direction: "column" },
      },
      draw: (props) => (
        <Room size="md">
          <examples.account.Account {...props} />
        </Room>
      ),
      example: examples.account,
      namespace: "tabs",
      order: ["variant", "palette", "size", "fitted", "justify"],
    }),
    orientation,
  ],
  title: "tabs.title",
});
