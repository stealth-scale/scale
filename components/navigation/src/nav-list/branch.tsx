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

import { useControllableState, useFilterActive, useFilteredRow } from "@stealthscale/hooks";

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
 *
 * @remarks
 *   Inside a search's scope, the branch registers the words it renders, its nested rows' words
 *   among them, and is hidden while the scope's query is not in them. While the scope has a query
 *   the branch is open, so a nested row that matches is visible, and a press on its trigger
 *   changes nothing. The branch keeps its own open state and passes the machine a boolean `open`
 *   at all times, so a cleared query returns the branch to the state it had before the query.
 */
export function Branch(props: BranchProps): ReactElement {
  const [options, rest] = splitBranchProps(props);
  const searching = useFilterActive();
  const { hidden, ref } = useFilteredRow<HTMLLIElement>();
  const [open, setOpen] = useControllableState({
    defaultValue: options.defaultOpen ?? false,
    onChange: (next: boolean) => {
      options.onOpenChange?.({ open: next });
    },
    value: options.open,
  });
  const api = useBranchMachine({
    ...options,
    onOpenChange: (details) => {
      if (!searching) setOpen(details.open);
    },
    open: searching || open,
  });

  return (
    <BranchProvider value={api}>
      <Held {...rest} {...api.getRootProps()} hidden={hidden || rest.hidden === true} ref={ref} />
    </BranchProvider>
  );
}
