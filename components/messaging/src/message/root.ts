/**
 * Renders one turn of a conversation, the run of messages one person sent together.
 *
 * @remarks
 *   The element is an `article`, so a screen reader's article command moves from turn to turn. Pass
 *   `aria-busy` while the turn's words still arrive: a screen reader defers a log's announcements
 *   until `aria-busy` is false, so it reads the finished turn once.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#message/context.ts";

/**
 * Renders the root `article` with the message's variants.
 */
export const Root = withProvider("article", "root");

/**
 * Describes the props of `Root`.
 */
export type RootProps = ComponentProps<typeof Root>;
