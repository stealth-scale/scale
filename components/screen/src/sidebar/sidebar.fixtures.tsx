/**
 * Builds the sidebars the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { Content } from "#sidebar/content.ts";
import { Footer } from "#sidebar/footer.ts";
import { Header } from "#sidebar/header.ts";
import { NavLabel } from "#sidebar/nav-label.tsx";
import { Nav } from "#sidebar/nav.tsx";
import { Root, type RootProps } from "#sidebar/root.tsx";

/**
 * Renders a part inside the root, which provides the variants.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root with the part inside it.
 */
export function aside(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders a part inside a nav block inside the root.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root with a block around the part.
 */
export function blocked(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Nav>{children}</Nav>
    </Root>
  );
}

/**
 * Renders a sidebar with a header and a footer around a block that contains a label and a link.
 *
 * @param props - The root's props.
 * @returns The sidebar.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Header>Acme</Header>
      <Content>
        <Nav>
          <NavLabel>Workspace</NavLabel>
          <a href="/invoices">Invoices</a>
        </Nav>
      </Content>
      <Footer>Account</Footer>
    </Root>
  );
}
