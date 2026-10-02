/**
 * Renders the input that edits a tag in place.
 *
 * @remarks
 *   The element is an `input` that shows while its tag is edited and grows with its text. Enter
 *   saves the tag, an empty tag is removed, and Escape restores it. Either returns the highlight to
 *   the tag. It has the tag's height, padding and text, and an edge in the field's ring color. It
 *   is named by `label`, which names the tag. Editing starts from a double press on the tag or from
 *   Enter on the highlighted tag, when the root's `editable` is set.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tags-input/context.ts";
import { useTagsInput } from "#tags-input/machine.ts";
import { useItem, useShared } from "#tags-input/state.ts";

/**
 * Renders the `input` with the tags input's item input class.
 */
const Editing = withContext("input", "itemInput");

/**
 * Describes the props of the item input: its accessible name and the props of an `input`.
 */
export interface ItemInputProps extends Omit<ComponentProps<typeof Editing>, "aria-label"> {
  /**
   * Accessible name of the input. Defaults to `Edit` and the tag, such as `Edit Bridge Ledger`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the item input with the machine's props.
 *
 * @param props - The accessible name and the props of the `input`, merged over the machine's.
 * @returns The `input` element.
 */
export function ItemInput({ label, ...rest }: ItemInputProps): ReactElement {
  const api = useTagsInput();
  const tag = useItem();
  const { readOnly } = useShared();
  const named = { "aria-label": label ?? `Edit ${tag.value}`, ...(readOnly ? { readOnly } : {}) };

  return <Editing {...mergeProps(api.getItemInputProps(tag), named, rest)} />;
}
