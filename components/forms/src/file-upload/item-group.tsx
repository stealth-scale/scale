/**
 * Renders a list of files: the accepted ones, or the ones the upload refused.
 *
 * @remarks
 *   The element is a `ul`, and each `FileUpload.Item` inside it is an `li`. `type` picks the list,
 *   which `FileUpload.Items` reads, and each item marks its row with it. An empty list is hidden.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#file-upload/context.ts";
import { type ItemType, useFileUpload } from "#file-upload/machine.ts";
import { ListedProvider } from "#file-upload/state.ts";

/**
 * Renders the `ul` with the file upload's item group class.
 */
const Listed = withContext("ul", "itemGroup");

/**
 * Describes the props of an item group: the list it renders and the props of a `ul`.
 */
export interface ItemGroupProps extends ComponentProps<typeof Listed> {
  /**
   * The list to render: `accepted` for the files the upload accepted, `rejected` for the files it
   * refused. Defaults to `accepted`.
   */
  readonly type?: ItemType | undefined;
}

/**
 * Renders the item group with the machine's props and provides its list to the items.
 *
 * @param props - The list and the props of the `ul`, merged over the machine's.
 * @returns The `ul` element.
 */
export function ItemGroup({ type = "accepted", ...rest }: ItemGroupProps): ReactElement {
  const api = useFileUpload();

  return (
    <ListedProvider value={type}>
      <Listed {...mergeProps(api.getItemGroupProps({ type }), rest)} />
    </ListedProvider>
  );
}
