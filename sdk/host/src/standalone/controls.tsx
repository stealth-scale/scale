/**
 * Renders the development panel's controls, one group per concern.
 */

import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";

import { AccessControls } from "#standalone/access-controls.tsx";
import { DataControls } from "#standalone/data-controls.tsx";
import { FlagControls } from "#standalone/flag-controls.tsx";
import { PageControls } from "#standalone/page-controls.tsx";
import { PluginControls } from "#standalone/plugin-controls.tsx";
import { SessionControls } from "#standalone/session-controls.tsx";
import { ShellControls } from "#standalone/shell-controls.tsx";

/**
 * Renders the page picker, then the session, the decisions, the flags, the plugin's switches, the
 * operations and the display.
 *
 * @returns The stack of groups.
 */
export function PanelControls(): ReactElement {
  return (
    <Stack gap="lg">
      <PageControls />
      <SessionControls />
      <AccessControls />
      <FlagControls />
      <PluginControls />
      <DataControls />
      <ShellControls />
    </Stack>
  );
}
