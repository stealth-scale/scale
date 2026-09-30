/**
 * Builds the sidebars the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { NavList } from "@stealthscale/component-navigation";

import { Content } from "#sidebar/content.ts";
import { Empty } from "#sidebar/empty.tsx";
import { Footer } from "#sidebar/footer.ts";
import { Header } from "#sidebar/header.ts";
import { NavLabel } from "#sidebar/nav-label.tsx";
import { Nav } from "#sidebar/nav.tsx";
import { Root, type RootProps } from "#sidebar/root.tsx";
import { Search } from "#sidebar/search.tsx";

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
 * Renders a sidebar whose header search filters two rows, with an empty message in the content.
 *
 * @param props - The root's props.
 * @returns The sidebar.
 */
export function filtered(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Header>
        <Search
          aria-label="Search pages"
          searchIndicator={<svg aria-hidden="true" />}
          shortcut="k"
        />
      </Header>
      <Content>
        <Nav aria-label="Pages">
          <NavList.Root>
            <NavList.Item>
              <NavList.Link href="/invoices">Invoices</NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="/customers">Customers</NavList.Link>
            </NavList.Item>
          </NavList.Root>
        </Nav>
        <Empty>No pages match</Empty>
      </Content>
    </Root>
  );
}

/**
 * Renders a sidebar whose header search filters a block that contains a link and no list rows.
 *
 * @returns The sidebar.
 */
export function unlisted(): ReactElement {
  return (
    <Root>
      <Header>
        <Search aria-label="Search pages" />
      </Header>
      <Content>
        <Nav aria-label="Account">
          <a href="/account">Account</a>
        </Nav>
      </Content>
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
