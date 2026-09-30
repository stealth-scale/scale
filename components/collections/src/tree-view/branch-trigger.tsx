/**
 * Renders the part of a branch's row that opens and closes the branch without selecting it.
 *
 * @remarks
 *   It serves a tree whose root sets `expandOnClick={false}`, where a press on the row selects and
 *   a press on the trigger opens. The trigger is a pointer target alone and is hidden from
 *   assistive technology: the row's ArrowRight and ArrowLeft open and close the branch.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `span` with the tree view's branch trigger class.
 */
const Triggered = withContext("span", "branchTrigger");

/**
 * Describes the props of a branch trigger: the props of a `span`.
 */
export type BranchTriggerProps = ComponentProps<typeof Triggered>;

/**
 * Renders the trigger with the machine's props, less its role, merged over the caller's.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function BranchTrigger(props: BranchTriggerProps): ReactElement {
  const { api } = useTreeView();
  const node = useNode();
  const trigger: BranchTriggerProps = {
    ...api.getBranchTriggerProps(node),
    "aria-hidden": true,
    role: undefined,
  };

  return <Triggered {...mergeProps(trigger, props)} />;
}
