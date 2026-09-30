/**
 * Renders the column of a file's name above its size, which takes the room the preview and the
 * delete trigger leave in the row.
 *
 * @remarks
 *   The element is a `span`. It shrinks below its content's width, so a long name truncates instead
 *   of pushing the delete trigger out of the row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#file-upload/context.ts";

/**
 * Renders the `span` with the file upload's item content class.
 */
export const ItemContent = withContext("span", "itemContent");

/**
 * Describes the props of the item content: the props of a `span`.
 */
export type ItemContentProps = ComponentProps<typeof ItemContent>;
