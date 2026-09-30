/**
 * Renders the rule from a step to the next one.
 *
 * @remarks
 *   The element is a `span`, hidden from assistive technology, because the list's order already
 *   gives the step that follows. The last step renders no rule. A rule after a completed step takes
 *   the palette's color.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#steps/context.ts";
import { useSteps } from "#steps/machine.ts";
import { useItem } from "#steps/state.ts";

/**
 * Renders the `span` with the steps' separator class.
 */
const Rule = withContext("span", "separator");

/**
 * Describes the props of the separator: the props of a `span`.
 */
export type SeparatorProps = ComponentProps<typeof Rule>;

/**
 * Renders the separator with the machine's separator props merged over the caller's, or nothing
 * after the last step.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element, or `null` for the last step.
 */
export function Separator(props: SeparatorProps): null | ReactElement {
  const { api } = useSteps();
  const { index } = useItem();

  if (api.getItemState({ index }).last) return null;

  return <Rule {...mergeProps(api.getSeparatorProps({ index }), { "aria-hidden": true }, props)} />;
}
