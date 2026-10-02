/**
 * Renders the visible label of the tree.
 *
 * @remarks
 *   The label reports itself to the root while it is mounted, and the tree points `aria-labelledby`
 *   at it for that time.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { useLabelled } from "#tree-view/state.ts";

/**
 * Renders the `div` with the tree view's label class.
 */
const Labelled = withContext("div", "label");

/**
 * Describes the props of the label: the props of a `div`.
 */
export type LabelProps = ComponentProps<typeof Labelled>;

/**
 * Renders the label with the machine's label props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Label(props: LabelProps): ReactElement {
  const { api } = useTreeView();

  useLabelled();

  return <Labelled {...mergeProps(api.getLabelProps(), props)} />;
}
