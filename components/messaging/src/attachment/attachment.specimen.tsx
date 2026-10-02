/**
 * Catalogue page for the attachment.
 *
 * @remarks
 *   `scenesOf` generates the orientation and size scenes from a group of three files in a room at
 *   the `sm` measure, the width of a phone. Hand-written scenes render every state and photos under
 *   a message. The words are keys under `attachment` in `locales/en/specimen/attachment.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as files from "#attachment/examples/files.example.tsx";
import * as photos from "#attachment/examples/photos.example.tsx";
import * as states from "#attachment/examples/states.example.tsx";
import { type GroupProps } from "#attachment/index.ts";
import { recipe } from "#attachment/recipe.ts";

/**
 * Hand-written scene for an attachment in each state.
 */
export const stated: Scene = {
  about: "attachment.states.about",
  draw: () => (
    <Room size="sm">
      <states.States />
    </Room>
  ),
  example: states,
  title: "attachment.states.title",
};

/**
 * Hand-written scene for tiles under a message.
 */
export const pictured: Scene = {
  about: "attachment.photosScene.about",
  draw: () => (
    <Room size="md">
      <photos.Photos />
    </Room>
  ),
  example: photos,
  title: "attachment.photosScene.title",
};

export default specimen({
  about: "attachment.about",
  id: "components/messaging/attachment",
  imports: 'import { Attachment } from "@stealthscale/component-messaging";',
  scenes: [
    ...scenesOf<GroupProps>(recipe, {
      draw: (props) => (
        <Room size="sm">
          <files.Files {...props} />
        </Room>
      ),
      example: files,
      namespace: "attachment",
      order: ["orientation", "size"],
    }),
    stated,
    pictured,
  ],
  title: "attachment.title",
});
