/**
 * Renders one attachment: a file's media, its name and details, and its actions.
 *
 * @remarks
 *   Inside `Attachment.Group` the element is an `li` and takes the group's size and orientation
 *   unless it states its own. Elsewhere it is a `div`. `state` is written as `data-state`: `idle`
 *   for a file not yet sent, `uploading` and `processing` while it is on its way, `error` when it
 *   failed, and `done`. The caller states the state in words as well, in the description, because
 *   the edge that marks it reports nothing to a screen reader.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#attachment/context.ts";
import { useGroupDefaults } from "#attachment/state.ts";

/**
 * Renders the `div` with the attachment's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Lists the states of an attachment.
 */
export type AttachmentState = "done" | "error" | "idle" | "processing" | "uploading";

/**
 * Describes the props of an attachment: its state, the recipe's variants and the props of a `div`.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * Where the file is on its way, `done` unless stated.
   */
  readonly state?: AttachmentState | undefined;
}

/**
 * Renders the attachment, an `li` inside a group.
 *
 * @param props - The state, the recipe's variants and the props of a `div`.
 * @returns The `div` or `li` element.
 */
export function Root({ orientation, size, state = "done", ...props }: RootProps): ReactElement {
  const group = useGroupDefaults();

  return (
    <Framed
      data-state={state}
      {...(group === undefined ? {} : { as: "li" })}
      {...omitUndefined({
        orientation: orientation ?? group?.orientation,
        size: size ?? group?.size,
      })}
      {...props}
    />
  );
}
