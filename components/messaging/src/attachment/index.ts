/**
 * Exports the attachment, which a caller composes as an `Attachment.Root` containing an
 * `Attachment.Media`, an `Attachment.Content` of an `Attachment.Title` and an
 * `Attachment.Description`, and `Attachment.Actions`, several of them inside an
 * `Attachment.Group`.
 */

export { Actions, type ActionsProps } from "#attachment/actions.ts";
export { Content, type ContentProps } from "#attachment/content.ts";
export { Description, type DescriptionProps } from "#attachment/description.ts";
export { Group, type GroupProps } from "#attachment/group.tsx";
export { Media, type MediaProps } from "#attachment/media.ts";
export { type AttachmentState, Root, type RootProps } from "#attachment/root.tsx";
export { Title, type TitleProps } from "#attachment/title.ts";
