/**
 * Renders the pages the part specifications test.
 */

import { type ReactElement, type ReactNode } from "react";

import { Actions } from "#page/actions.tsx";
import { Body } from "#page/body.tsx";
import { Description } from "#page/description.ts";
import { Footer } from "#page/footer.tsx";
import { Header } from "#page/header.tsx";
import { Nav } from "#page/nav.tsx";
import { Root, type RootProps } from "#page/root.tsx";
import { Title } from "#page/title.ts";

/**
 * Renders a part inside a page root.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The page.
 */
export function paged(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders a page with a header, a navigation, a body and a footer.
 *
 * @param props - The root's props.
 * @returns The page.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Header>
        <Title>April</Title>
        <Actions>
          <button type="button">Download</button>
        </Actions>
        <Description>What this workspace was charged for in April.</Description>
      </Header>
      <Nav aria-label="Invoice">
        <span>Lines</span>
      </Nav>
      <Body>The lines of the invoice.</Body>
      <Footer>
        <span>Paid on 3 May.</span>
      </Footer>
    </Root>
  );
}
