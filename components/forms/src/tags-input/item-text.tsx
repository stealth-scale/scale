/**
 * Renders a tag's words: the tag itself unless the caller passes other children.
 *
 * @remarks
 *   The element is the tag's label `span`, which truncates with an ellipsis when the tag is wider
 *   than the control.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Tag } from "@stealthscale/component-data";

import { useTagsInput } from "#tags-input/machine.ts";
import { useItem } from "#tags-input/state.ts";

/**
 * Describes the props of the text: the props of the tag's label.
 */
export type ItemTextProps = ComponentProps<typeof Tag.Label>;

/**
 * Renders the text with the machine's props and the tag as its children.
 *
 * @param props - Attributes and children of the `span`, merged over the machine's.
 * @returns The `span` element.
 */
export function ItemText(props: ItemTextProps): ReactElement {
  const api = useTagsInput();
  const tag = useItem();

  return <Tag.Label {...mergeProps(api.getItemTextProps(tag), { children: tag.value }, props)} />;
}
