/**
 * Catalogue page for the toggle group.
 *
 * @remarks
 *   The toggle group has no recipe of its own: the layout's `Group` lays the items out and the
 *   button's recipe draws them, so every scene is hand-written. The looks and sizes scenes turn the
 *   formatting example's `variant` and `size`. The single scene shows the alignment example, the
 *   orientation scene turns its `orientation`, the spaced scene shows filters with a gap and one
 *   filter disabled, and the states scene a disabled group. The words are keys under
 *   `toggle-group` in `locales/en/specimen/toggle-group.json`.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/specimen";

import * as examples from "#toggle-group/examples/index.ts";
import type * as ToggleGroup from "#toggle-group/index.ts";

/**
 * Props of the disabled scene's group.
 */
const DISABLED: ToggleGroup.RootProps = { disabled: true };

/**
 * Looks of the looks scene: the button's looks that show which icon items are on, in reading order.
 *
 * @remarks
 *   The solid look marks a pressed button with an inset shadow and a semibold label, and an icon
 *   has no label to set in bold, so the scene leaves it out.
 */
const LOOKS = ["outline", "subtle", "surface", "ghost", "plain"] as const;

/**
 * Sizes of the sizes scene.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Orientations of the orientation scene.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

/**
 * Hand-written scene for every look of the items.
 */
export const looks: Scene = {
  about: "toggle-group.looks.about",
  draw: () => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => <examples.formatting.Formatting variant={variant} />}
    </Matrix>
  ),
  example: examples.formatting,
  props: { variant: "outline" },
  title: "toggle-group.looks.title",
};

/**
 * Hand-written scene for every size of the items.
 */
export const sizes: Scene = {
  about: "toggle-group.sizes.about",
  draw: () => (
    <Matrix knob="size" of={SIZES}>
      {(size) => <examples.formatting.Formatting size={size} />}
    </Matrix>
  ),
  example: examples.formatting,
  props: { size: "xs" },
  title: "toggle-group.sizes.title",
};

/**
 * Hand-written scene for a group that keeps one item on.
 */
export const single: Scene = {
  about: "toggle-group.single.about",
  draw: () => <examples.alignment.Alignment />,
  example: examples.alignment,
  title: "toggle-group.single.title",
};

/**
 * Hand-written scene for a group in a row and in a column.
 */
export const orientation: Scene = {
  about: "toggle-group.orientation.about",
  draw: () => (
    <Matrix knob="orientation" of={ORIENTATIONS}>
      {(way) => <examples.alignment.Alignment orientation={way} />}
    </Matrix>
  ),
  example: examples.alignment,
  props: { orientation: "horizontal" },
  title: "toggle-group.orientation.title",
};

/**
 * Hand-written scene for spaced items, one of them disabled.
 */
export const spaced: Scene = {
  about: "toggle-group.spaced.about",
  draw: examples.filters.Filters,
  example: examples.filters,
  title: "toggle-group.spaced.title",
};

/**
 * Hand-written scene for a disabled group.
 */
export const states: Scene = {
  about: "toggle-group.states.about",
  draw: () => <examples.formatting.Formatting {...DISABLED} />,
  example: examples.formatting,
  props: { disabled: true },
  title: "toggle-group.states.title",
};

export default specimen({
  about: "toggle-group.about",
  id: "components/actions/toggle-group",
  imports: 'import { ToggleGroup } from "@stealthscale/component-actions";',
  scenes: [looks, sizes, single, orientation, spaced, states],
  title: "toggle-group.title",
});
