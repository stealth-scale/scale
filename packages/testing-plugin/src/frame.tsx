/**
 * Renders the frame a plugin's components render in where a specification passes none.
 */

import { type ReactElement } from "react";

import { hostContract } from "@stealthscale/sdk-core";
import { HostContent, HostRoot } from "@stealthscale/sdk-host";
import { Slot } from "@stealthscale/sdk-plugin";

/**
 * Renders every region of the host around the page, so an extension or a page's contribution
 * placed in any region renders.
 */
export function PluginFrame(): ReactElement {
  const { slots } = hostContract;

  return (
    <HostRoot>
      <Slot slot={slots.header} />
      <Slot slot={slots.brand} />
      <Slot slot={slots.navigation} />
      <Slot slot={slots.toolbar} />
      <Slot slot={slots.userMenu} />
      <Slot slot={slots.status} />
      <main>
        <HostContent />
      </main>
      <Slot slot={slots.aside} />
      <Slot slot={slots.footer} />
    </HostRoot>
  );
}
