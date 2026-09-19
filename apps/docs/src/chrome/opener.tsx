/**
 * Draws the control that opens and closes the navigation as the library's button.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { AppShell } from "@stealthscale/component-screen";

/**
 * Describes what the control takes: everything the shell's trigger takes.
 */
export type OpenerProps = AppShell.TriggerProps;

/**
 * Draws the shell's trigger as a quiet square, which holds one glyph.
 *
 * @remarks
 *   A component of its own, because the trigger is drawn as the button through `as`, and the
 *   toolbar's item draws this through `as` in turn. One element then carries the row's tab stop,
 *   the panel it opens and the button's look.
 * @param props - Everything the shell's trigger takes.
 * @returns The control.
 */
export function Opener(props: OpenerProps): ReactElement {
  return (
    <ButtonPropsProvider value={{ shape: "square", size: "md", variant: "ghost" }}>
      <AppShell.Trigger as={Button} {...props} />
    </ButtonPropsProvider>
  );
}
