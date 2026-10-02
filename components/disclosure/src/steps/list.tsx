/**
 * Renders the ordered list of steps.
 *
 * @remarks
 *   The element is an `ol`, so a screen reader announces the steps as a list with a count. The
 *   machine's `tablist` role, `aria-owns` and `aria-orientation` are dropped: no key moves between
 *   the steps, and the tab pattern announces keys that do nothing. The list measures whether its
 *   steps fit its row at their natural width and sets `data-crowded` when they do not, so titles
 *   placed beside the discs move below them. The list takes no `ref`, because it attaches its own.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { useCrowded } from "@stealthscale/hooks";

import { withContext } from "#steps/context.ts";
import { useSteps } from "#steps/machine.ts";

/**
 * Renders the `ol` with the steps' list class.
 */
const Listed = withContext("ol", "list");

/**
 * Describes the props of the list: the props of an `ol` without `ref`.
 */
export type ListProps = Omit<ComponentProps<typeof Listed>, "ref">;

/**
 * Renders the list with the machine's list props, less its tab semantics, and the crowded state
 * merged over the caller's.
 *
 * @param props - The props of an `ol`.
 * @returns The `ol` element.
 */
export function List(props: ListProps): ReactElement {
  const { api } = useSteps();
  const [crowded, ref] = useCrowded();
  const list: ComponentProps<typeof Listed> = {
    ...api.getListProps(),
    "aria-orientation": undefined,
    "aria-owns": undefined,
    "data-crowded": crowded ? "" : undefined,
    role: undefined,
  };

  return <Listed {...mergeProps(list, props)} ref={ref} />;
}
