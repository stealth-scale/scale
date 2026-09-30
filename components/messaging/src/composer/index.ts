/**
 * Exports the composer, which a caller composes as a `Composer.Root` containing a
 * `Composer.Context` strip while it replies, `Composer.Attachments`, the `Composer.Input` and a
 * `Composer.Toolbar` with a `Composer.AttachTrigger` and a `Composer.Submit`.
 */

export { AttachTrigger, type AttachTriggerProps } from "#composer/attach-trigger.tsx";
export { Attachments, type AttachmentsProps } from "#composer/attachments.ts";
export { Context, type ContextProps } from "#composer/context-strip.ts";
export { Input, type InputProps } from "#composer/input.tsx";
export { type Query } from "#composer/mentions.ts";
export { Root, type RootProps } from "#composer/root.tsx";
export { type SubmitKey } from "#composer/state.ts";
export { Submit, type SubmitProps } from "#composer/submit.tsx";
export { Toolbar, type ToolbarProps } from "#composer/toolbar.ts";
export { type Suggestion } from "#composer/use-mentions.ts";
