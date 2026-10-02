/**
 * Renders what the flow shows once every step is completed.
 *
 * @remarks
 *   The element is a `div` with the content class. The machine counts the flow as completed when
 *   the step equals `count`, one past the last step, which a press on the next trigger sets from
 *   the last step. It is `hidden` until then.
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
 * Describes the props of the completed content: the props of a `div`.
 */
export type CompletedContentProps = ComponentProps<typeof Shown>;

/**
 * Renders the completed content with the machine's content props for the step after the last,
 * less its tab semantics, merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function CompletedContent(props: CompletedContentProps): ReactElement {
  const { api } = useSteps();
  const content: CompletedContentProps = {
    ...api.getContentProps({ index: api.count }),
    "aria-labelledby": undefined,
    role: undefined,
    tabIndex: undefined,
  };

  return <Shown {...mergeProps(content, props)} />;
}
