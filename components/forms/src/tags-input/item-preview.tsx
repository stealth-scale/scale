/**
 * Renders a tag at rest: the library's tag with its text and its delete trigger.
 *
 * @remarks
 *   The element is the tag's `span`, at the tag size of the tags input's size, in the tag's own
 *   looks and palettes. A press on it highlights it and keeps focus in the input, and a double
 *   press edits it when tags are editable. A highlighted tag takes a ring in the field's ring
 *   color. The machine hides the preview while its tag is edited.
 */

import { type JSX, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Tag } from "@stealthscale/component-data";

import { withContext } from "#tags-input/context.ts";
import { useTagsInput } from "#tags-input/machine.ts";
import { useItem, useShared } from "#tags-input/state.ts";

/**
 * Renders the library's tag with the tags input's preview class.
 *
 * @remarks
 *   The type names the tag's published props, because the inferred one names a type the data
 *   package does not export.
 */
const Chip: (props: Tag.RootProps) => JSX.Element = withContext(Tag.Root, "itemPreview");

/**
 * Describes the props of the preview: the tag's variants less its size, and the props of a
 * `span`.
 */
export type ItemPreviewProps = Omit<Tag.RootProps, "size">;

/**
 * Renders the preview with the machine's props at the tags input's size.
 *
 * @param props - The tag's variants and the attributes and children of the `span`, merged over
 *   the machine's.
 * @returns The `span` element.
 */
export function ItemPreview(props: ItemPreviewProps): ReactElement {
  const { size } = useShared();

  return <Chip {...mergeProps(useTagsInput().getItemPreviewProps(useItem()), props)} size={size} />;
}
