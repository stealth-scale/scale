/**
 * Catalogue page for the image cropper.
 *
 * @remarks
 *   The hand-written scenes show a crop with every handle, a round profile picture exported into
 *   an avatar, a cover with rotation and flip, a fixed frame the picture pans under, and a free
 *   crop that reports its size. `scenesOf` generates the corner scene from the photo example. Each
 *   cropper renders in a room at its real width, and the picture is a generated file beside the
 *   examples. The words are keys under `image-cropper` in
 *   `locales/en/specimen/image-cropper.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#image-cropper/examples/index.ts";
import type * as ImageCropper from "#image-cropper/index.ts";
import { recipe } from "#image-cropper/recipe.ts";

/**
 * Hand-written scene for a crop with every handle and the lines of thirds.
 */
export const photo: Scene = {
  about: "image-cropper.photo.about",
  draw: () => (
    <Room size="sm">
      <examples.photo.Photo />
    </Room>
  ),
  example: examples.photo,
  title: "image-cropper.photo.title",
};

/**
 * Hand-written scene for a round crop exported into an avatar.
 */
export const profile: Scene = {
  about: "image-cropper.profile.about",
  draw: () => (
    <Room size="sm">
      <examples.profile.Profile />
    </Room>
  ),
  example: examples.profile,
  title: "image-cropper.profile.title",
};

/**
 * Hand-written scene for a 16:9 crop with rotation, flip and reset.
 */
export const cover: Scene = {
  about: "image-cropper.cover.about",
  draw: () => (
    <Room size="sm">
      <examples.cover.Cover />
    </Room>
  ),
  example: examples.cover,
  title: "image-cropper.cover.title",
};

/**
 * Hand-written scene for a fixed frame the picture pans under.
 */
export const banner: Scene = {
  about: "image-cropper.banner.about",
  draw: () => (
    <Room size="sm">
      <examples.banner.Banner />
    </Room>
  ),
  example: examples.banner,
  title: "image-cropper.banner.title",
};

/**
 * Hand-written scene for a crop of any shape that reports its size.
 */
export const free: Scene = {
  about: "image-cropper.free.about",
  draw: () => (
    <Room size="sm">
      <examples.free.Free />
    </Room>
  ),
  example: examples.free,
  title: "image-cropper.free.title",
};

export default specimen({
  about: "image-cropper.about",
  id: "components/media/image-cropper",
  imports: 'import { ImageCropper } from "@stealthscale/component-media";',
  scenes: [
    photo,
    profile,
    cover,
    banner,
    free,
    ...scenesOf<Omit<ImageCropper.RootProps, "cropper">>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <examples.photo.Photo {...props} />
        </Room>
      ),
      example: examples.photo,
      namespace: "image-cropper",
    }),
  ],
  title: "image-cropper.title",
});
