/**
 * Catalogue page for the scroll area.
 *
 * @remarks
 *   The hand-written scenes show a card's release notes that scroll top to bottom, a row of
 *   topic filters that scrolls sideways, the theme's palettes that scroll both ways, and the
 *   palettes right to left. `scenesOf` generates the visibility, size, inset, fade and height
 *   scenes from the release notes. Each area renders in a room at its real width. The words are
 *   keys under `scroll-area` in `locales/en/specimen/scroll-area.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#scroll-area/examples/index.ts";
import type * as ScrollArea from "#scroll-area/index.ts";
import { recipe } from "#scroll-area/recipe.ts";

/**
 * Hand-written scene for a card's release notes that scroll top to bottom.
 */
export const notes: Scene = {
  about: "scroll-area.notes.about",
  axes: ["scrolls"],
  draw: () => (
    <Room size="xs">
      <examples.notes.Notes />
    </Room>
  ),
  example: examples.notes,
  title: "scroll-area.notes.title",
};

/**
 * Hand-written scene for a row of topic filters that scrolls sideways.
 */
export const topics: Scene = {
  about: "scroll-area.topics.about",
  axes: ["scrolls"],
  draw: () => (
    <Room size="sm">
      <examples.topics.Topics />
    </Room>
  ),
  example: examples.topics,
  title: "scroll-area.topics.title",
};

/**
 * Hand-written scene for the theme's palettes, which scroll both ways.
 */
export const palette: Scene = {
  about: "scroll-area.palette.about",
  axes: ["scrolls"],
  draw: () => (
    <Room size="sm">
      <examples.palette.Palette />
    </Room>
  ),
  example: examples.palette,
  title: "scroll-area.palette.title",
};

/**
 * Hand-written scene for the palettes laid out right to left.
 */
export const rtl: Scene = {
  about: "scroll-area.rtl.about",
  draw: () => (
    <Room size="sm">
      <examples.palette.Palette dir="rtl" />
    </Room>
  ),
  example: examples.palette,
  props: { dir: "rtl" },
  title: "scroll-area.rtl.title",
};

export default specimen({
  about: "scroll-area.about",
  id: "components/primitives/scroll-area",
  imports: 'import { ScrollArea } from "@stealthscale/component-primitives";',
  scenes: [
    notes,
    topics,
    palette,
    rtl,
    ...scenesOf<ScrollArea.RootProps>(recipe, {
      axes: { size: { with: { variant: "always" } } },
      draw: (props) => (
        <Room size="xs">
          <examples.notes.Notes {...props} />
        </Room>
      ),
      example: examples.notes,
      namespace: "scroll-area",
      order: ["variant", "size", "inset", "fade", "maxHeight"],
      skip: { scrolls: "The notes, the topics and the palettes render one value each." },
    }),
  ],
  title: "scroll-area.title",
});
