/**
 * Renders what a step asks for, shown while the step is current.
 *
 * @remarks
 *   The element is a `div` without the machine's `tabpanel` role, `tabIndex` and `aria-labelledby`,
 *   because the steps are a list and not tabs. The machine sets `hidden` while the step is not
 *   current, so a control inside it leaves the tab order.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#steps/context.ts";
import { useSteps } from "#steps/machine.ts";

/**
 * Renders the `div` with the steps' content class.
 */
const Shown = withContext("div", "content");

/**
 * Describes the props of the content: the index of its step and the props of a `div`.
 */
export interface ContentProps extends ComponentProps<typeof Shown> {
  /**
   * Index of the step the content belongs to, from zero.
   */
  readonly index: number;
}

/**
 * Renders the content with the machine's content props, less its tab semantics, merged over the
 * caller's.
 *
 * @param props - The step's index and the props of a `div`.
 * @returns The `div` element.
 */
export function Content({ index, ...rest }: ContentProps): ReactElement {
  const { api } = useSteps();
  const content: ComponentProps<typeof Shown> = {
    ...api.getContentProps({ index }),
    "aria-labelledby": undefined,
    role: undefined,
    tabIndex: undefined,
  };

  return <Shown {...mergeProps(content, rest)} />;
}
