/**
 * Builds the shells the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { ViewportProvider } from "@stealthscale/provider-viewport";

import { Aside } from "#app-shell/aside.tsx";
import { Body } from "#app-shell/body.tsx";
import { Footer } from "#app-shell/footer.tsx";
import { Header } from "#app-shell/header.tsx";
import { Main } from "#app-shell/main.tsx";
import { Navbar, type NavbarProps } from "#app-shell/navbar.tsx";
import { Root, type RootProps } from "#app-shell/root.tsx";
import { Status } from "#app-shell/status.tsx";
import { Trigger } from "#app-shell/trigger.tsx";

/**
 * Renders a part inside the root, which provides the variants and the store.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root with the part inside it.
 */
export function shell(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders a part inside the body inside the root.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root with a body around the part.
 */
export function bodied(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Body>{children}</Body>
    </Root>
  );
}

/**
 * Renders a subtree in a 375px viewport, where both panels fold.
 *
 * @param children - The shell under test.
 * @returns The subtree inside the viewport provider.
 */
export function narrowed(children: ReactNode): ReactElement {
  return <ViewportProvider defaultWidth={375}>{children}</ViewportProvider>;
}

/**
 * Renders a subtree in an 820px viewport, where the start side fits and the end side folds.
 *
 * @param children - The shell under test.
 * @returns The subtree inside the viewport provider.
 */
export function tablet(children: ReactNode): ReactElement {
  return <ViewportProvider defaultWidth={820}>{children}</ViewportProvider>;
}

/**
 * Renders a whole shell: a header with the trigger, the three regions of the body, a footer and a
 * status bar.
 *
 * @param props - The navbar's props.
 * @returns The shell.
 */
export function composed(props: NavbarProps = {}): ReactElement {
  return (
    <Root>
      <Header>
        <Trigger>Navigation</Trigger>
      </Header>
      <Body>
        <Navbar {...props}>
          <a href="/invoices">Invoices</a>
        </Navbar>
        <Main>Billing</Main>
        <Aside aria-label="Detail">Totals</Aside>
      </Body>
      <Footer>Acme</Footer>
      <Status>Saved</Status>
    </Root>
  );
}
