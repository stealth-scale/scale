/**
 * Renders the name of a step, and its state in words for a screen reader.
 *
 * @remarks
 *   The element is a `span`, so it fits inside the trigger's `button`. Before the name it renders
 *   "Completed: " for a completed step and "Current: " for the current one, visually hidden, as the
 *   W3C's tutorial on multi-page forms marks a progress list. A later step has no prefix. The words
 *   are the `completedLabel` and `currentLabel` props. The title also sets the step's state as
 *   `data-complete`, `data-current` or `data-incomplete`, and a later step's title takes the muted
 *   ink.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#steps/context.ts";
import { useSteps } from "#steps/machine.ts";
import { useItem } from "#steps/state.ts";

/**
 * Renders the `span` with the steps' title class.
 */
const Named = withContext("span", "title");

/**
 * Renders the visually hidden `span` with the steps' status class.
 */
const Hidden = withContext("span", "status");

/**
 * Describes the props of the title: the words for the two announced states and the props of a
 * `span`.
 */
export interface TitleProps extends ComponentProps<typeof Named> {
  /**
   * Hidden words before the name of a completed step, "Completed: " unless the caller passes
   * others.
   */
  readonly completedLabel?: string | undefined;

  /**
   * Hidden words before the name of the current step, "Current: " unless the caller passes others.
   */
  readonly currentLabel?: string | undefined;
}

/**
 * Renders the title, with the hidden words for the step's state before the caller's children.
 *
 * @param props - The words for each state and the props of a `span`.
 * @returns The `span` element.
 */
export function Title({
  children,
  completedLabel = "Completed: ",
  currentLabel = "Current: ",
  ...rest
}: TitleProps): ReactElement {
  const { api } = useSteps();
  const { index } = useItem();
  const state = api.getItemState({ index });
  const prefix = [
    [state.completed, completedLabel],
    [state.current, currentLabel],
  ].find(([matched]) => matched === true)?.[1];

  return (
    <Named
      {...rest}
      data-complete={state.completed ? "" : undefined}
      data-current={state.current ? "" : undefined}
      data-incomplete={state.incomplete ? "" : undefined}
    >
      {typeof prefix === "string" ? <Hidden>{prefix}</Hidden> : null}
      {children}
    </Named>
  );
}
