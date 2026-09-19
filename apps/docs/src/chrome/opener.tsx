/**
 * Draws the control that opens and closes the navigation as the library's button, holding the
 * glyph that says which it will do.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { AppShell } from "@stealthscale/component-screen";

import { Panel } from "#chrome/panel.tsx";

/**
 * Describes what the control takes: everything the shell's trigger takes.
 */
export type OpenerProps = AppShell.TriggerProps;

/**
 * Draws the shell's trigger as a quiet square holding the panel glyph.
 *
 * @remarks
 *   A component of its own, because the trigger is drawn as the button through `as`, and the
 *   toolbar's item draws this through `as` in turn. One element then carries the row's tab stop,
 *   the panel it opens and the button's look. The glyph reads the panel's state, so it shows the
 *   arrow that closes the navigation while it is open.
 * @param props - Everything the shell's trigger takes.
 * @returns The control.
 */
export function Opener(props: OpenerProps): ReactElement {
  const open = AppShell.useAppShellPanel("navbar")?.open ?? false;

  return (
    <ButtonPropsProvider
      value={{ shape: "square", size: "sm", status: "neutral", variant: "ghost" }}
    >
      <AppShell.Trigger as={Button} {...props}>
        <Panel open={open} />
      </AppShell.Trigger>
    </ButtonPropsProvider>
  );
}
