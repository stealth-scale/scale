/**
 * Renders a file's name.
 *
 * @remarks
 *   The element is a `span` on one line, which ends in an ellipsis when the name is wider than the
 *   row. It renders the file's name unless the caller passes children.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#file-upload/context.ts";
import { useFileUpload } from "#file-upload/machine.ts";
import { useItem } from "#file-upload/state.ts";

/**
 * Renders the `span` with the file upload's item name class.
 */
const Named = withContext("span", "itemName");

/**
 * Describes the props of the name: the props of a `span`.
 */
export type ItemNameProps = ComponentProps<typeof Named>;

/**
 * Renders the name with the machine's props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element.
 */
export function ItemName({ children, ...rest }: ItemNameProps): ReactElement {
  const api = useFileUpload();
  const item = useItem();

  return (
    <Named {...mergeProps(api.getItemNameProps(item), rest)}>{children ?? item.file.name}</Named>
  );
}
