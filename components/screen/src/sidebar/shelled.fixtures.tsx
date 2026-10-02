/**
 * Builds the app shells the sidebar's specifications render a sidebar in.
 */

import { type ReactElement, type ReactNode } from "react";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Body } from "#app-shell/body.tsx";
import { Header } from "#app-shell/header.tsx";
import { Navbar, type NavbarProps } from "#app-shell/navbar.tsx";
import { Root as Shell } from "#app-shell/root.tsx";
import { Trigger } from "#app-shell/trigger.tsx";
import { blocked, filtered } from "#sidebar/sidebar.fixtures.tsx";

/**
 * Renders a sidebar in the navigation panel of a shell.
 *
 * @param props - The panel's props.
 * @param sidebar - The sidebar, the filtering one by default.
 * @returns The shell.
 */
export function paneled(props: NavbarProps, sidebar: ReactNode = filtered()): ReactElement {
  return (
    <Shell>
      <Body>
        <Navbar {...props}>{sidebar}</Navbar>
      </Body>
    </Shell>
  );
}

/**
 * Renders a shell with a trigger whose navigation contains a sidebar with a link and a button.
 *
 * @returns The shell.
 */
export function shelled(): ReactElement {
  return (
    <Shell>
      <Header>
        <Trigger>Navigation</Trigger>
      </Header>
      <Body>
        <Navbar>
          {blocked(
            <>
              <a href="#invoices">Invoices</a>
              <button type="button">Refresh</button>
            </>,
          )}
        </Navbar>
      </Body>
    </Shell>
  );
}

/**
 * Renders the shell at a phone's width, where its navigation is a sheet.
 *
 * @returns The shell in a 375px viewport.
 */
export function sheeted(): ReactElement {
  return narrowed(shelled());
}
