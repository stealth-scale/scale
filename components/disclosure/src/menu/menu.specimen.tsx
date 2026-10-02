/**
 * Catalogue page for the menu.
 *
 * @remarks
 *   `scenesOf` generates the looks, the highlights by sizes and the palettes from the actions
 *   example, and the gutter from the column example, whose rows mix icon rows and plain rows. The
 *   placement, mark, long-list, context-menu, submenu and right-to-left scenes are hand-written,
 *   because each shows a machine option, a part or a behaviour that no axis sets. Every menu
 *   renders closed and portals its panel to the document body, so an opened panel renders over the
 *   page at the size the window allows, and a scene is as tall as its triggers. A single trigger
 *   renders in a `Sample`, which keeps it at its own width. The words are keys under `menu` in
 *   `locales/en/specimen/menu.json`.
 */

import { Matrix, Sample, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#menu/examples/index.ts";
import type * as Menu from "#menu/index.ts";
import { recipe } from "#menu/recipe.ts";

/**
 * Placements of the placement scene.
 */
const PLACEMENTS = ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end"] as const;

/**
 * Hand-written scene for six placements, with the arrow on each panel.
 */
export const placements: Scene = {
  about: "menu.placements.about",
  draw: () => (
    <Matrix knob="placement" of={PLACEMENTS}>
      {(placement) => <examples.more.More positioning={{ placement }} />}
    </Matrix>
  ),
  example: examples.more,
  props: { positioning: { placement: "bottom-start" } },
  title: "menu.placements.title",
};

/**
 * Hand-written scene for rows that lead with a mark and read a name over a description.
 */
export const marks: Scene = {
  about: "menu.marks.about",
  draw: () => (
    <Sample>
      <examples.workspaces.Workspaces />
    </Sample>
  ),
  example: examples.workspaces,
  title: "menu.marks.title",
};

/**
 * Hand-written scene for a list longer than the window.
 */
export const long: Scene = {
  about: "menu.long.about",
  draw: () => (
    <Sample>
      <examples.ledgers.Ledgers />
    </Sample>
  ),
  example: examples.ledgers,
  title: "menu.long.title",
};

/**
 * Hand-written scene for a menu that opens over a region at the pointer.
 */
export const over: Scene = {
  about: "menu.over.about",
  draw: examples.card.Card,
  example: examples.card,
  title: "menu.over.title",
};

/**
 * Hand-written scene for a submenu opened from a row.
 */
export const submenus: Scene = {
  about: "menu.submenus.about",
  draw: () => (
    <Sample>
      <examples.actions.Actions />
    </Sample>
  ),
  example: examples.actions,
  title: "menu.submenus.title",
};

/**
 * Hand-written scene for a menu in a right-to-left document.
 */
export const rtl: Scene = {
  about: "menu.rtl.about",
  draw: () => (
    <div dir="rtl">
      <examples.actions.Actions dir="rtl" />
    </div>
  ),
  example: examples.actions,
  props: { dir: "rtl" },
  title: "menu.rtl.title",
};

export default specimen({
  about: "menu.about",
  id: "components/disclosure/menu",
  imports: 'import { Menu } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Menu.RootProps>(recipe, {
      axes: {
        highlight: { across: "size" },
        inset: {
          draw: (props) => <examples.column.Column {...props} />,
          example: examples.column,
        },
      },
      draw: (props) => <examples.actions.Actions {...props} />,
      example: examples.actions,
      namespace: "menu",
      order: ["variant", "highlight", "inset", "palette"],
    }),
    placements,
    marks,
    long,
    over,
    submenus,
    rtl,
  ],
  title: "menu.title",
});
