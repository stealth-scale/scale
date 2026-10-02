/**
 * Catalogue page for the message.
 *
 * @remarks
 *   The first scene renders a short exchange: another person's turn at the start of the line and
 *   the reader's own at the end. `scenesOf` generates the look, palette, size, align and reveal
 *   scenes from one turn of two messages, each in a room at the `sm` measure, the width of a phone.
 *   Hand-written scenes render the delivery states, a message that did not send, an answer in the
 *   plain look, and a comment thread. The words are keys under `message` in
 *   `locales/en/specimen/message.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as answer from "#message/examples/answer.example.tsx";
import * as delivery from "#message/examples/delivery.example.tsx";
import * as exchange from "#message/examples/exchange.example.tsx";
import * as failed from "#message/examples/failed.example.tsx";
import * as thread from "#message/examples/thread.example.tsx";
import * as turn from "#message/examples/turn.example.tsx";
import { type RootProps } from "#message/index.ts";
import { recipe } from "#message/recipe.ts";

/**
 * Hand-written scene for another person's turn and the reader's reply.
 */
export const exchanged: Scene = {
  about: "message.exchange.about",
  draw: () => (
    <Room size="sm">
      <exchange.Exchange />
    </Room>
  ),
  example: exchange,
  title: "message.exchange.title",
};

/**
 * Hand-written scene for the reader's messages in each delivery state.
 */
export const delivered: Scene = {
  about: "message.delivery.about",
  draw: () => (
    <Room size="sm">
      <delivery.Delivery />
    </Room>
  ),
  example: delivery,
  title: "message.delivery.title",
};

/**
 * Hand-written scene for a message that did not send, with a retry.
 */
export const unsent: Scene = {
  about: "message.failure.about",
  draw: () => (
    <Room size="sm">
      <failed.Failed />
    </Room>
  ),
  example: failed,
  title: "message.failure.title",
};

/**
 * Hand-written scene for an answer that reads as a document.
 */
export const answered: Scene = {
  about: "message.answer.about",
  draw: () => (
    <Room size="md">
      <answer.Answer />
    </Room>
  ),
  example: answer,
  title: "message.answer.title",
};

/**
 * Hand-written scene for a thread of comments the reader edits, deletes and answers.
 */
export const threaded: Scene = {
  about: "message.thread.about",
  draw: () => (
    <Room size="md">
      <thread.Thread />
    </Room>
  ),
  example: thread,
  title: "message.thread.title",
};

export default specimen({
  about: "message.about",
  id: "components/messaging/message",
  imports: 'import { Message } from "@stealthscale/component-messaging";',
  scenes: [
    exchanged,
    ...scenesOf<RootProps>(recipe, {
      draw: (props) => (
        <Room size="sm">
          <turn.Turn {...props} />
        </Room>
      ),
      example: turn,
      namespace: "message",
      order: ["look", "palette", "size", "align", "reveal"],
    }),
    delivered,
    unsent,
    answered,
    threaded,
  ],
  title: "message.title",
});
