/**
 * Catalogue page for the carousel.
 *
 * @remarks
 *   The hand-written scenes show a gallery with its controls over the pictures, a rotation with its
 *   rotation control, two cards a page, a vertical carousel and a carousel an outside control
 *   drives. `scenesOf` generates the controls, palette, corner and ratio scenes from the gallery.
 *   Each carousel renders in a room at its real width, and the pictures are generated files beside
 *   the examples. The words are keys under `carousel` in `locales/en/specimen/carousel.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#carousel/examples/index.ts";
import type * as Carousel from "#carousel/index.ts";
import { recipe } from "#carousel/recipe.ts";

/**
 * Hand-written scene for pictures with the controls over them.
 */
export const gallery: Scene = {
  about: "carousel.gallery.about",
  draw: () => (
    <Room size="sm">
      <examples.gallery.Gallery />
    </Room>
  ),
  example: examples.gallery,
  title: "carousel.gallery.title",
};

/**
 * Hand-written scene for a carousel that rotates by itself.
 */
export const rotation: Scene = {
  about: "carousel.rotation.about",
  draw: () => (
    <Room size="sm">
      <examples.rotation.Rotation />
    </Room>
  ),
  example: examples.rotation,
  title: "carousel.rotation.title",
};

/**
 * Hand-written scene for two cards a page that move one at a time.
 */
export const cards: Scene = {
  about: "carousel.cards.about",
  draw: () => (
    <Room size="md">
      <examples.cards.Cards />
    </Room>
  ),
  example: examples.cards,
  title: "carousel.cards.title",
};

/**
 * Hand-written scene for slides that run top to bottom.
 */
export const vertical: Scene = {
  about: "carousel.vertical.about",
  draw: () => (
    <Room size="sm">
      <examples.vertical.Vertical />
    </Room>
  ),
  example: examples.vertical,
  title: "carousel.vertical.title",
};

/**
 * Hand-written scene for a carousel whose page an outside control sets.
 */
export const controlled: Scene = {
  about: "carousel.controlled.about",
  draw: () => (
    <Room size="sm">
      <examples.controlled.Controlled />
    </Room>
  ),
  example: examples.controlled,
  title: "carousel.controlled.title",
};

export default specimen({
  about: "carousel.about",
  id: "components/media/carousel",
  imports: 'import { Carousel } from "@stealthscale/component-media";',
  scenes: [
    gallery,
    rotation,
    cards,
    vertical,
    controlled,
    ...scenesOf<Omit<Carousel.RootProps, "slideCount">>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <examples.gallery.Gallery {...props} />
        </Room>
      ),
      example: examples.gallery,
      namespace: "carousel",
    }),
  ],
  title: "carousel.title",
});
