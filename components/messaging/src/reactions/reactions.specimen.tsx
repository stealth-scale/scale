/**
 * Catalogue page for the reactions.
 *
 * @remarks
 *   The recipe has no axis, so the one scene is hand-written: a message with reactions under it
 *   that a press toggles, and a picker that adds one, in a room at the `sm` measure. The words are
 *   keys under `reactions` in `locales/en/specimen/reactions.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as reacting from "#reactions/examples/reacting.example.tsx";

/**
 * Hand-written scene for reactions under a message.
 */
export const reacted: Scene = {
  about: "reactions.reacting.about",
  draw: () => (
    <Room size="sm">
      <reacting.Reacting />
    </Room>
  ),
  example: reacting,
  title: "reactions.reacting.title",
};

export default specimen({
  about: "reactions.about",
  id: "components/messaging/reactions",
  imports: 'import { Reactions } from "@stealthscale/component-messaging";',
  scenes: [reacted],
  title: "reactions.title",
});
