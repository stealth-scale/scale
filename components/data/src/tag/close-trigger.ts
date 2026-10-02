/**
 * Renders the button that removes the tag.
 *
 * @remarks
 *   The element is a `button` with `type` defaulting to `button`. It contains only a glyph, so its
 *   props type requires `aria-label` or `aria-labelledby`. Name what it removes, such as
 *   `Remove payouts`, because a screen reader otherwise announces a list of buttons named `Remove`.
 */

import { type ComponentProps, type JSX } from "react";

import { withContext } from "#tag/context.ts";

/**
 * Renders the close `button` with `type` defaulting to `button`.
 */
const Trigger = withContext("button", "closeTrigger", { defaultProps: { type: "button" } });

/**
 * Describes the prop that gives the close trigger its accessible name as text.
 */
interface Labelled {
  /**
   * The name a screen reader announces, including what the button removes.
   */
  readonly "aria-label": string;
}

/**
 * Describes the prop that takes the close trigger's accessible name from another element.
 */
interface LabelledBy {
  /**
   * The id of the element whose text names the button.
   */
  readonly "aria-labelledby": string;
}

/**
 * Describes the props of `CloseTrigger`: the props of a `button` and a required accessible name.
 */
export type CloseTriggerProps = ComponentProps<typeof Trigger> & (Labelled | LabelledBy);

/**
 * Renders the close `button`, which requires an accessible name.
 */
export const CloseTrigger: (props: CloseTriggerProps) => JSX.Element = Trigger;
