/**
 * Catalogue page for the tabs.
 *
 * @remarks
 *   `scenesOf` generates the looks, palettes, sizes, fitted tabs and distributions from the account
 *   example, whose list scrolls sideways where the tabs are wider than their room. The fitted scene
 *   uses the enclosed look, where each tab's width shows. The orientation scene is hand-written,
 *   because the orientation is the machine's option and not an axis, and draws a vertical list of
 *   preferences. Three more hand-written scenes close tabs: files in a `2xl` room, drafts that
 *   overflow an `md` room, and a controlled list closed from outside. Each generated set renders in
 *   an `md` room, open on its first panel. The words are keys under `tabs` in
 *   `locales/en/specimen/tabs.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#tabs/examples/index.ts";
import type * as Tabs from "#tabs/index.ts";
import { recipe } from "#tabs/recipe.ts";

/**
 * Hand-written scene for a vertical list.
 */
export const orientation: Scene = {
  about: "tabs.orientation.about",
  draw: () => (
    <Room size="lg">
      <examples.preferences.Preferences />
    </Room>
  ),
  example: examples.preferences,
  title: "tabs.orientation.title",
};

/**
 * Hand-written scene for closable tabs over a list of files.
 */
export const closing: Scene = {
  about: "tabs.closing.about",
  draw: () => (
    <Room size="2xl">
      <examples.files.Files />
    </Room>
  ),
  example: examples.files,
  title: "tabs.closing.title",
};

/**
 * Hand-written scene for a list of tabs wider than its room.
 */
export const scrolling: Scene = {
  about: "tabs.scrolling.about",
  draw: () => (
    <Room size="md">
      <examples.drafts.Drafts />
    </Room>
  ),
  example: examples.drafts,
  title: "tabs.scrolling.title",
};

/**
 * Hand-written scene for a close from outside the list.
 */
export const controlled: Scene = {
  about: "tabs.controlled.about",
  draw: () => (
    <Room size="md">
      <examples.reader.Reader />
    </Room>
  ),
  example: examples.reader,
  title: "tabs.controlled.title",
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
    closing,
    scrolling,
    controlled,
  ],
  title: "tabs.title",
});
