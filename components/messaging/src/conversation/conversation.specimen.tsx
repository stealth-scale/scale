/**
 * Catalogue page for the conversation.
 *
 * @remarks
 *   The recipe has no axis, so every scene is hand-written, each in a room at the `sm` measure, the
 *   width of a phone. The scenes render a transcript of two days, a chat that answers what the
 *   reader sends, an assistant whose answer streams, older messages that load at the top, and an
 *   inbox of conversations. The words are keys under `conversation` in
 *   `locales/en/specimen/conversation.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as assistant from "#conversation/examples/assistant.example.tsx";
import * as chat from "#conversation/examples/chat.example.tsx";
import * as history from "#conversation/examples/history.example.tsx";
import * as inbox from "#conversation/examples/inbox.example.tsx";
import * as transcript from "#conversation/examples/transcript.example.tsx";

/**
 * Hand-written scene for two days of grouped turns.
 */
export const transcribed: Scene = {
  about: "conversation.transcript.about",
  draw: () => (
    <Room size="sm">
      <transcript.Transcript />
    </Room>
  ),
  example: transcript,
  title: "conversation.transcript.title",
};

/**
 * Hand-written scene for a chat that answers what the reader sends.
 */
export const chatted: Scene = {
  about: "conversation.chat.about",
  draw: () => (
    <Room size="sm">
      <chat.Chat />
    </Room>
  ),
  example: chat,
  title: "conversation.chat.title",
};

/**
 * Hand-written scene for an assistant's answer that streams after its reasoning and tool call.
 */
export const assisted: Scene = {
  about: "conversation.assisting.about",
  draw: () => (
    <Room size="md">
      <assistant.Assistant />
    </Room>
  ),
  example: assistant,
  title: "conversation.assisting.title",
};

/**
 * Hand-written scene for older messages that load at the top.
 */
export const paged: Scene = {
  about: "conversation.history.about",
  draw: () => (
    <Room size="sm">
      <history.History />
    </Room>
  ),
  example: history,
  title: "conversation.history.title",
};

/**
 * Hand-written scene for a list of conversations.
 */
export const listed: Scene = {
  about: "conversation.inbox.about",
  draw: () => (
    <Room size="sm">
      <inbox.Inbox />
    </Room>
  ),
  example: inbox,
  title: "conversation.inbox.title",
};

export default specimen({
  about: "conversation.about",
  id: "components/messaging/conversation",
  imports: 'import { Conversation, groupTurns } from "@stealthscale/component-messaging";',
  scenes: [transcribed, chatted, assisted, paged, listed],
  title: "conversation.title",
});
