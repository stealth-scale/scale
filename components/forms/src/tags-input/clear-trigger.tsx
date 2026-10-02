/**
 * Renders the button that removes every tag.
 *
 * @remarks
 *   The element is a `button` in the tab order, because no key removes every tag at once. The
 *   machine hides it while there are no tags, and a read-only tags input hides it. A press removes
 *   every tag and the typed text, and moves focus to the input. It is the input group's square
 *   button, named by `label`. The glyph is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tags-input/context.ts";
import { useTagsInput } from "#tags-input/machine.ts";
import { useShared } from "#tags-input/state.ts";

/**
 * Renders the `button` with the tags input's clear trigger class.
 */
const Cleared = withContext("button", "clearTrigger");

/**
 * Describes the props of the clear trigger: its accessible name and the props of a `button`.
 */
export interface ClearTriggerProps extends Omit<ComponentProps<typeof Cleared>, "aria-label"> {
  /**
   * Accessible name of the button. Defaults to `Clear all`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the clear trigger with the machine's props.
 *
 * @param props - The accessible name and the props of the `button`, merged over the machine's.
 * @returns The `button` element.
 */
export function ClearTrigger({ label = "Clear all", ...rest }: ClearTriggerProps): ReactElement {
  const { readOnly } = useShared();
  const named = { "aria-label": label, ...(readOnly ? { hidden: true } : {}) };

  return <Cleared {...mergeProps(useTagsInput().getClearTriggerProps(), named, rest)} />;
}
