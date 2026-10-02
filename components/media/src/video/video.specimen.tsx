/**
 * Catalogue page for the video.
 *
 * @remarks
 *   `scenesOf` generates the ratio, fit and corner scenes from the clip example, each clip in an
 *   `xs` room, and the fit scene sets the clip in a square, the one shape where the two fits
 *   differ. The hand-written scenes show a clip the reader starts, a loop that starts by itself,
 *   and a background loop with its own pause button. The clip and its poster are generated files
 *   beside the examples, so no scene loads from the network. The words are keys under `video` in
 *   `locales/en/specimen/video.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#video/examples/index.ts";
import { type VideoProps } from "#video/index.ts";
import { recipe } from "#video/recipe.ts";

/**
 * Hand-written scene for a clip the reader starts from the browser's controls.
 */
export const tour: Scene = {
  about: "video.tour.about",
  draw: () => (
    <Room size="sm">
      <examples.tour.Tour />
    </Room>
  ),
  example: examples.tour,
  title: "video.tour.title",
};

/**
 * Hand-written scene for a loop that starts by itself while the reader allows motion.
 */
export const loop: Scene = {
  about: "video.loop.about",
  draw: () => (
    <Room size="sm">
      <examples.loop.Loop />
    </Room>
  ),
  example: examples.loop,
  title: "video.loop.title",
};

/**
 * Hand-written scene for a background loop without controls and with its own pause button.
 */
export const background: Scene = {
  about: "video.background.about",
  draw: () => (
    <Room size="sm">
      <examples.background.Background />
    </Room>
  ),
  example: examples.background,
  title: "video.background.title",
};

export default specimen({
  about: "video.about",
  id: "components/media/video",
  imports: 'import { Video } from "@stealthscale/component-media";',
  scenes: [
    tour,
    loop,
    background,
    ...scenesOf<VideoProps>(recipe, {
      axes: { fit: { with: { ratio: "square" } } },
      draw: (props) => (
        <Room size="xs">
          <examples.clip.Clip {...props} />
        </Room>
      ),
      example: examples.clip,
      namespace: "video",
      order: ["ratio", "fit", "radius"],
    }),
  ],
  title: "video.title",
});
