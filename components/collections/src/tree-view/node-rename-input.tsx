/**
 * Renders the field that replaces a row's text while the node is renamed.
 *
 * @remarks
 *   F2 on a row starts renaming where the root's `canRename` allows it. The field opens with the
 *   node's text selected, Enter or leaving the field submits a text that is not blank, and Escape
 *   cancels. Focus returns to the row either way. The field is `hidden` while its node is not
 *   renamed, and named "Rename" unless the caller passes another `label`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `input` with the tree view's node rename input class.
 */
const Renamed = withContext("input", "nodeRenameInput");

/**
 * Describes the props of the rename input: its accessible name and the props of an `input`.
 */
export interface NodeRenameInputProps extends ComponentProps<typeof Renamed> {
  /**
   * Accessible name of the field, "Rename" unless the caller passes another.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the field with the machine's props merged over the caller's.
 *
 * @param props - The field's name and the props of an `input`.
 * @returns The `input` element.
 */
export function NodeRenameInput({ label = "Rename", ...rest }: NodeRenameInputProps): ReactElement {
  const { api } = useTreeView();

  return (
    <Renamed {...mergeProps(api.getNodeRenameInputProps(useNode()), rest)} aria-label={label} />
  );
}
