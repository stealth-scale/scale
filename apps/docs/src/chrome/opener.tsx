/**
 * Renders the control that opens and closes the navigation, as the library's button holding the
 * icon for the action it performs.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { AppShell } from "@stealthscale/component-screen";

import { Panel } from "#chrome/panel.tsx";

/**
 * Describes the props of `Opener`, which are the shell trigger's props.
 */
export type OpenerProps = AppShell.TriggerProps;

/**
 * Renders the shell's trigger as a small square ghost button holding the panel icon.
 *
 * @remarks
 *   It is a component because the toolbar item renders it through `as`, and it renders the trigger
 *   through `as` in turn. One element then takes the row's tab stop, the reference to the panel and
 *   the button's styles. The icon reads the panel's state and shows the close arrow while the
 *   navigation is open.
 * @param props - The shell trigger's props.
 * @returns The control.
 */
export function Opener(props: OpenerProps): ReactElement {
  const open = AppShell.useAppShellPanel("navbar")?.open ?? false;

  return (
    <ButtonPropsProvider
      value={{ palette: "neutral", shape: "square", size: "sm", variant: "ghost" }}
    >
      <AppShell.Trigger as={Button} {...props}>
        <Panel open={open} />
      </AppShell.Trigger>
    </ButtonPropsProvider>
  );
}
