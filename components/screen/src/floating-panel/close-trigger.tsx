/**
 * Renders the button at the end of the header that closes the panel.
 *
 * @remarks
 *   The element is the actions `Button` as a square, the `IconButton`'s shape, ghost and `xs`
 *   unless the caller sets a variant or a size, with the caller's glyph. The machine sets the
 *   English name "Close Window" on the button, so the trigger takes its name from `label`, "Close"
 *   by default. Escape closes the panel as well.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#floating-panel/context.ts";
import { useFloatingPanel } from "#floating-panel/machine.ts";

/**
 * Renders the actions `Button` as a square with the floating panel's close trigger class, ghost and
 * `xs` unless the caller sets a variant or a size: the `IconButton`, whose name the trigger sets.
 */
const Drawn: (props: ButtonProps) => ReactElement = withContext(Button, "closeTrigger", {
  defaultProps: { shape: "square", size: "xs", variant: "ghost" },
});

/**
 * Describes the props of the close trigger: the name and the props of the icon button.
 */
export interface CloseTriggerProps extends Omit<
  ButtonProps,
  "aria-label" | "aria-labelledby" | "ref"
> {
  /**
   * Accessible name of the button. Defaults to "Close".
   */
  readonly label?: string | undefined;
}

/**
 * Renders the close trigger with the machine's close trigger props and its name merged under the
 * caller's.
 *
 * @param props - The name, the glyph and the props of the icon button.
 * @returns The `button` element.
 */
export function CloseTrigger({ label = "Close", ...props }: CloseTriggerProps): ReactElement {
  const { api } = useFloatingPanel();
  const machine: ButtonProps = { ...api.getCloseTriggerProps(), "aria-label": label };

  return <Drawn {...mergeProps(machine, props)} />;
}
