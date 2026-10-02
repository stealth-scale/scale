/**
 * Connects the tree view machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so every row reports the
 *   same focus, selection, expansion and checks. The machine reads the caller's collection and
 *   never changes it: a caller that renames or loads nodes replaces the collection it passes.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as treeView from "@zag-js/tree-view";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `treeView.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version.
 */
export type TreeViewApi = ReturnType<typeof treeView.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props: the tree takes its name from
 *   `TreeView.Label` or `aria-label`, and the rename input takes its own `label`.
 */
export type TreeViewOptions = Omit<Partial<treeView.Props>, "translations">;

/**
 * Describes what the root provides to its parts: the connected api and whether rows are checked.
 */
export interface TreeViewMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: TreeViewApi;

  /**
   * Whether the rows have `aria-checked` and Space checks a row.
   */
  readonly checkable: boolean;

  /**
   * ID of the label while `TreeView.Label` is mounted, or nothing.
   */
  readonly labelledBy: string | undefined;
}

/**
 * Creates the context through which the root provides the running machine to its parts.
 *
 * @remarks
 *   `useTreeView` throws when no `TreeView.Root` is mounted above the calling part.
 */
export const [MachineProvider, useTreeView] = createRequiredContext<TreeViewMachine>("TreeView");

/**
 * Starts the tree view machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. React generates `id` when the
 *   caller states none.
 */
export function useTreeViewMachine(options: TreeViewOptions): TreeViewApi {
  const generated = useId();
  const service = useMachine(treeView.machine, {
    ...omitUndefined(options),
    id: options.id ?? generated,
  });

  return treeView.connect(service, normalizeProps);
}

/**
 * Returns the ID the machine gives the label, which the tree points `aria-labelledby` at.
 */
export function labelId(api: TreeViewApi): string {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine always gives the label a string ID
  return api.getLabelProps()["id"] as string;
}

/**
 * Splits the root's props into machine settings and element props, without `translations`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitTreeViewProps<Props extends TreeViewOptions>(
  props: Props,
): [TreeViewOptions, Omit<Props, keyof treeView.Props>] {
  const [options, rest] = splitEnumerable(treeView.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
