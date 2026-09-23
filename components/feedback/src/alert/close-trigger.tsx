/**
 * Renders the button that dismisses the alert.
 *
 * @remarks
 *   The element is a `button` with `type="button"` that holds the caller's icon. `label` sets its
 *   `aria-label` and defaults to `Dismiss`. Pass a label that names the notice, such as
 *   `Dismiss payment failed`, because a screen reader lists every close trigger on a page by name.
 *   The recipe takes the ink from the alert, so the trigger matches every look and status.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Button with the close trigger slot classes and `type="button"`.
 */
const Styled = withContext("button", "closeTrigger", { defaultProps: { type: "button" } });

/**
 * Describes the props of Alert.CloseTrigger: the accessible name and the props of a button.
 */
export interface CloseTriggerProps extends ComponentProps<typeof Styled> {
  /**
   * Accessible name of the button. Defaults to `Dismiss`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders a square button in the alert's ink, named by `label`.
 */
export function CloseTrigger({ label = "Dismiss", ...rest }: CloseTriggerProps): ReactElement {
  return <Styled aria-label={label} {...rest} />;
}
