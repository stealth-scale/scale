/**
 * Renders the button that removes a tag.
 *
 * @remarks
 *   The element is the tag's close `button`, out of the tab order, because Backspace and Delete
 *   remove a highlighted tag from the input. A press removes the tag and returns focus to the
 *   input. It is named by `label`, which names the tag, so a screen reader does not read a row of
 *   buttons with one name. A read-only tags input hides it. The glyph is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Tag } from "@stealthscale/component-data";

import { useTagsInput } from "#tags-input/machine.ts";
import { useItem, useShared } from "#tags-input/state.ts";

/**
 * Describes the props of the delete trigger: its accessible name and the props of a `button`.
 */
export interface ItemDeleteTriggerProps extends Omit<
  ComponentProps<typeof Tag.CloseTrigger>,
  "aria-label" | "aria-labelledby"
> {
  /**
   * Accessible name of the button. Defaults to `Remove` and the tag, such as
   * `Remove Bridge Ledger`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the delete trigger with the machine's props.
 *
 * @param props - The accessible name and the props of the `button`, merged over the machine's.
 * @returns The `button` element.
 */
export function ItemDeleteTrigger({ label, ...rest }: ItemDeleteTriggerProps): ReactElement {
  const api = useTagsInput();
  const tag = useItem();
  const { readOnly } = useShared();
  const name = label ?? `Remove ${tag.value}`;

  return (
    <Tag.CloseTrigger
      {...mergeProps(api.getItemDeleteTriggerProps(tag), readOnly ? { hidden: true } : {}, rest)}
      aria-label={name}
    />
  );
}
