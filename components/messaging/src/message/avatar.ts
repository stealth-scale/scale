/**
 * Renders the box around the sender's avatar, at the side of the line the turn belongs to.
 *
 * @remarks
 *   The caller renders the avatar inside, such as the media package's `Avatar.Root`. The box is
 *   aligned to the top of the turn, next to the header, at any height of the turn.
 */

import { type ComponentProps } from "react";

import { withContext } from "#message/context.ts";

/**
 * Renders the avatar's `div`.
 */
export const Avatar = withContext("div", "avatar");

/**
 * Describes the props of `Avatar`.
 */
export type AvatarProps = ComponentProps<typeof Avatar>;
