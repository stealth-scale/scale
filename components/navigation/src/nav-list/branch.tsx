/**
 * Renders a list row that expands a nested list, and runs the collapsible machine for it.
 *
 * @remarks
 *   The element is `li`, so the branch is an item of the surrounding list. It accepts the machine's
 *   settings, `open`, `defaultOpen` and `onOpenChange` among them, so a caller can open the branch
 *   that contains the current page or leave the branch uncontrolled. `id` and `dir` are omitted
 *   from the element props because the machine sets both. It derives the ARIA references from `id`
 *   and reads `dir` for the indicator's direction.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#nav-list/context.ts";
import {
  type BranchOptions,
  BranchProvider,
  splitBranchProps,
  useBranchMachine,
} from "#nav-list/machine.ts";

/**
 * Renders the branch `li` with the list's variants.
 */
const Held = withContext("li", "branch");

/**
 * Describes the props of `Branch`: the machine settings and the styled `li` props.
 */
export interface BranchProps
  extends BranchOptions, Omit<ComponentProps<typeof Held>, "dir" | "id"> {}

/**
 * Renders the branch and provides the running machine to its trigger, indicator and content.
 */
export function Branch(props: BranchProps): ReactElement {
  const [options, rest] = splitBranchProps(props);
  const api = useBranchMachine(options);

  return (
    <BranchProvider value={api}>
      <Held {...rest} {...api.getRootProps()} />
    </BranchProvider>
  );
}
