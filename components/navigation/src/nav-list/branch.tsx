/**
 * Draws a row that opens onto a list of its own, and runs the machine that shows and hides it.
 *
 * @remarks
 *   The element is `li`, because a branch is a row of the list around it. It takes the machine's
 *   own settings, `open`, `defaultOpen` and `onOpenChange` among them, so a caller that opens the
 *   branch holding the current page drives it and a caller that does not is served by the same
 *   component. The element's own `id` and `dir` are left out, because the machine states both: it
 *   builds every ARIA reference from the id, and it reads the direction to place the mark.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#nav-list/context.ts";
import {
  type BranchOptions,
  BranchProvider,
  splitBranchProps,
  useBranchMachine,
} from "#nav-list/state.ts";

/**
 * Draws the branch at the size the list states.
 */
const Held = withContext("li", "branch");

/**
 * Describes what a branch takes: the machine's settings and everything a styled list item takes.
 */
export interface BranchProps
  extends BranchOptions, Omit<ComponentProps<typeof Held>, "dir" | "id"> {}

/**
 * Shows and hides the list beneath its row.
 *
 * @param props - The machine's settings and the element's props together.
 * @returns The branch, holding the trigger and the list under the running machine.
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
