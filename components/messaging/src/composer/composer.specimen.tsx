/**
 * Catalogue page for the composer.
 *
 * @remarks
 *   `scenesOf` generates the look and size scenes from a composer with a text and the attach and
 *   send controls, each in a room at the `sm` measure, the width of a phone. Hand-written scenes
 *   render a reply with files, an answer the send control stops, and the edit of the last message.
 *   The words are keys under `composer` in `locales/en/specimen/composer.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as edit from "#composer/examples/edit.example.tsx";
import * as mentions from "#composer/examples/mentions.example.tsx";
import * as reply from "#composer/examples/reply.example.tsx";
import * as stopping from "#composer/examples/stopping.example.tsx";
import * as writing from "#composer/examples/writing.example.tsx";
import { type RootProps } from "#composer/index.ts";
import { recipe } from "#composer/recipe.ts";

/**
 * Hand-written scene for a reply with files.
 */
export const replied: Scene = {
  about: "composer.reply.about",
  draw: () => (
    <Room size="sm">
      <reply.Reply />
    </Room>
  ),
  example: reply,
  title: "composer.reply.title",
};

/**
 * Hand-written scene for an answer the send control stops.
 */
export const stopped: Scene = {
  about: "composer.stopping.about",
  draw: () => (
    <Room size="sm">
      <stopping.Stopping />
    </Room>
  ),
  example: stopping,
  title: "composer.stopping.title",
};

/**
 * Hand-written scene for mentions typed with `@`.
 */
export const mentioned: Scene = {
  about: "composer.mentions.about",
  draw: () => (
    <Room size="sm">
      <mentions.Mentions />
    </Room>
  ),
  example: mentions,
  title: "composer.mentions.title",
};

/**
 * Hand-written scene for the edit of the last message.
 */
export const edited: Scene = {
  about: "composer.edit.about",
  draw: () => (
    <Room size="sm">
      <edit.EditLast />
    </Room>
  ),
  example: edit,
  title: "composer.edit.title",
};

export default specimen({
  about: "composer.about",
  id: "components/messaging/composer",
  imports: 'import { Composer } from "@stealthscale/component-messaging";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      axes: { size: { direction: "column" }, variant: { direction: "column" } },
      draw: (props) => (
        <Room size="sm">
          <writing.Writing {...props} />
        </Room>
      ),
      example: writing,
      namespace: "composer",
      order: ["variant", "size"],
    }),
    replied,
    mentioned,
    stopped,
    edited,
  ],
  title: "composer.title",
});
