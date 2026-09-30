/**
 * Renders one file's row.
 *
 * @remarks
 *   The element is an `li`, so it belongs in a `FileUpload.ItemGroup`, whose list it takes. It
 *   provides its file to the preview, the name, the size and the delete trigger inside it. A row of
 *   a refused file takes the error edge.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#file-upload/context.ts";
import { useFileUpload } from "#file-upload/machine.ts";
import { ItemProvider, useListed } from "#file-upload/state.ts";

/**
 * Renders the `li` with the file upload's item class.
 */
const Row = withContext("li", "item");

/**
 * Describes the props of an item: its file and the props of an `li`.
 */
export interface ItemProps extends ComponentProps<typeof Row> {
  /**
   * The file the row renders.
   */
  readonly file: File;
}

/**
 * Renders the item with the machine's props and provides its file to the parts inside it.
 *
 * @param props - The file and the props of the `li`.
 * @returns The `li` element.
 */
export function Item({ file, ...rest }: ItemProps): ReactElement {
  const api = useFileUpload();
  const item = { file, type: useListed() };

  return (
    <ItemProvider value={item}>
      <Row {...mergeProps(api.getItemProps(item), rest)} />
    </ItemProvider>
  );
}
