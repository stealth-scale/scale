/**
 * Exports the message, which a caller composes as a `Message.Root` turn containing a
 * `Message.Avatar` and a `Message.Content` column of a `Message.Header`, one `Message.Bubble` per
 * message, and a `Message.Footer` with a `Message.Status` and `Message.Actions`.
 */

export { Actions, type ActionsProps } from "#message/actions.ts";
export { Avatar, type AvatarProps } from "#message/avatar.ts";
export { Bubble, type BubbleProps } from "#message/bubble.tsx";
export { Content, type ContentProps } from "#message/content.ts";
export { Footer, type FooterProps } from "#message/footer.ts";
export { Header, type HeaderProps } from "#message/header.ts";
export { Root, type RootProps } from "#message/root.ts";
export { type MessageStatus, Status, type StatusProps } from "#message/status.tsx";
