/**
 * Renders the frame of the standalone page: every region of the host around the page, and the
 * development panel in the `overlay` region.
 */

import { type ReactElement } from "react";

import { AppShell } from "@stealthscale/component-screen";
import { hostContract } from "@stealthscale/sdk-core";
import { Into, Slot, useSlot } from "@stealthscale/sdk-plugin";

import { HostContent } from "#parts/content.tsx";
import { HostRoot } from "#parts/root.tsx";
import { StandalonePanel } from "#standalone/panel.tsx";

/**
 * Renders the shell with a bar, a column and a band for each region a contribution fills, the page
 * in the main region, and the panel through `Into`.
 *
 * @remarks
 *   A region nobody fills renders no part of the shell, so an empty aside takes no column, as a
 *   product's frame leaves it out.
 * @returns The host's root around the shell.
 */
export function StandaloneFrame(): ReactElement {
  const { slots } = hostContract;
  const header = [useSlot(slots.brand), useSlot(slots.header), useSlot(slots.userMenu)].some(
    ({ filled }) => filled,
  );
  const navigation = useSlot(slots.navigation).filled;
  const aside = useSlot(slots.aside).filled;
  const footer = useSlot(slots.footer).filled;
  const status = useSlot(slots.status).filled;

  return (
    <HostRoot>
      <AppShell.Root>
        {header ? (
          <AppShell.Header>
            <Slot slot={slots.brand} />
            <Slot slot={slots.header} />
            <Slot slot={slots.userMenu} />
          </AppShell.Header>
        ) : null}
        <AppShell.Body>
          {navigation ? (
            <AppShell.Navbar>
              <Slot slot={slots.navigation} />
            </AppShell.Navbar>
          ) : null}
          <AppShell.Main>
            <HostContent />
          </AppShell.Main>
          {aside ? (
            <AppShell.Aside>
              <Slot slot={slots.aside} />
            </AppShell.Aside>
          ) : null}
        </AppShell.Body>
        {footer ? (
          <AppShell.Footer>
            <Slot slot={slots.footer} />
          </AppShell.Footer>
        ) : null}
        {status ? (
          <AppShell.Status>
            <Slot slot={slots.status} />
          </AppShell.Status>
        ) : null}
      </AppShell.Root>
      <Into slot={slots.overlay}>
        <StandalonePanel />
      </Into>
    </HostRoot>
  );
}
