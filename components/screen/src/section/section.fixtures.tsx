/**
 * Renders the sections the part specifications test.
 */

import { type ReactElement, type ReactNode } from "react";

import { Actions } from "#section/actions.ts";
import { Body } from "#section/body.ts";
import { Description } from "#section/description.ts";
import { Footer } from "#section/footer.ts";
import { Header } from "#section/header.ts";
import { Root, type RootProps } from "#section/root.tsx";
import { Title } from "#section/title.tsx";

/**
 * Renders a part inside a section root.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The section.
 */
export function blocked(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders a section with a header, a body and a footer.
 *
 * @param props - The root's props.
 * @returns The section.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Header>
        <Title>Billing</Title>
        <Description>How this workspace pays for what it uses.</Description>
        <Actions>
          <button type="button">Change plan</button>
        </Actions>
      </Header>
      <Body>The plan and the invoices.</Body>
      <Footer>
        <span>Billed monthly.</span>
        <button type="button">Cancel</button>
      </Footer>
    </Root>
  );
}
