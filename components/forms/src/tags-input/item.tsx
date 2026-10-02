/**
 * Renders one tag's item: the tag and the input that edits it.
 *
 * @remarks
 *   The element is a `span`. It provides its tag to the preview, the text, the delete trigger and
 *   the item input inside it. The machine finds the tags by their items, so a press inside an item
 *   keeps focus in the tags input. A disabled item keeps its tag and disables its delete trigger.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#tags-input/context.ts";
import { useTagsInput } from "#tags-input/machine.ts";
import { ItemProvider } from "#tags-input/state.ts";

/**
 * Renders the `span` with the tags input's item class.
 */
const Wrapped = withContext("span", "item");

/**
 * Describes the props of an item: its tag and the props of a `span`.
 */
export interface ItemProps extends ComponentProps<typeof Wrapped> {
  /**
   * Whether the tag cannot be removed or edited on its own.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Position of the tag, from zero.
   */
  readonly index: number;

  /**
   * The tag.
   */
  readonly value: string;
}

/**
 * Renders the item with the machine's props and provides its tag to the parts inside it.
 *
 * @param props - The tag, its position, whether it is disabled, and the props of the `span`.
 * @returns The `span` element.
 */
export function Item({ disabled, index, value, ...rest }: ItemProps): ReactElement {
  const api = useTagsInput();
  const tag = { index, value, ...omitUndefined({ disabled }) };

  return (
    <ItemProvider value={tag}>
      <Wrapped {...mergeProps(api.getItemProps(tag), rest)} />
    </ItemProvider>
  );
}
