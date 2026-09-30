/**
 * Renders the square that shows what a file is: the caller's glyph, or a picture of an image file.
 *
 * @remarks
 *   The element is a `span` hidden from assistive technology, because the file's name is beside it.
 *   Put a glyph in it, or `FileUpload.ItemPreviewImage` for an image file.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#file-upload/context.ts";
import { useFileUpload } from "#file-upload/machine.ts";
import { useItem } from "#file-upload/state.ts";

/**
 * Renders the `span` with the file upload's item preview class.
 */
const Previewed = withContext("span", "itemPreview");

/**
 * Describes the props of the preview: the props of a `span`.
 */
export type ItemPreviewProps = ComponentProps<typeof Previewed>;

/**
 * Renders the preview with the machine's props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element.
 */
export function ItemPreview(props: ItemPreviewProps): ReactElement {
  const hidden = { "aria-hidden": true };

  return (
    <Previewed {...mergeProps(useFileUpload().getItemPreviewProps(useItem()), hidden, props)} />
  );
}
