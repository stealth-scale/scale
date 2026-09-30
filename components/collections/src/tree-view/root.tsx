/**
 * Renders the tree view's root and starts the machine its parts share.
 *
 * @remarks
 *   The root is a `div` around the label and the tree. It provides the running machine, whether the
 *   rows are checked, and the ID of the label while `TreeView.Label` is mounted, which the tree
 *   names itself by. While it is mounted it tracks whether the last input was a key, which a row
 *   reads to mark a focus from the keyboard.
 */

import { type ComponentProps, type ReactElement, useEffect, useState } from "react";

import { trackFocusVisible } from "@zag-js/focus-visible";
import { mergeProps } from "@zag-js/react";

import { withProvider } from "#tree-view/context.ts";
import {
  labelId,
  MachineProvider,
  splitTreeViewProps,
  type TreeViewOptions,
  useTreeViewMachine,
} from "#tree-view/machine.ts";
import { LabellingProvider } from "#tree-view/state.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, whether rows are checked, the recipe's
 * variants and the props of a `div`.
 *
 * @remarks
 *   The element's `dir` and `id` are left out, because the machine takes both.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Framed>, "dir" | "id">, TreeViewOptions {
  /**
   * Whether every row has a check, which Space and a press on `TreeView.NodeCheckbox` toggle.
   * A branch is checked while every node under it is, and partly checked while some are.
   */
  readonly checkable?: boolean | undefined;
}

/**
 * Renders the root and provides the running machine to the parts.
 *
 * @param props - The machine's options, `checkable`, the recipe's variants and the props of a
 *   `div`.
 * @returns The `div` element inside the providers.
 */
export function Root({ checkable = false, ...props }: RootProps): ReactElement {
  const [options, rest] = splitTreeViewProps(props);
  const api = useTreeViewMachine(options);
  const [labelled, setLabelled] = useState(false);
  const labelledBy = labelled ? labelId(api) : undefined;

  useEffect(() => trackFocusVisible(), []);

  return (
    <MachineProvider value={{ api, checkable, labelledBy }}>
      <LabellingProvider value={setLabelled}>
        <Framed {...mergeProps(api.getRootProps(), rest)} />
      </LabellingProvider>
    </MachineProvider>
  );
}
