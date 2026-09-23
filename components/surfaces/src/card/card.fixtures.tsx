/**
 * Builds the card trees the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { Aside } from "#card/aside.ts";
import { Content } from "#card/content.ts";
import { Description } from "#card/description.ts";
import { Footer } from "#card/footer.ts";
import { Header } from "#card/header.ts";
import { Indicator } from "#card/indicator.ts";
import { Media } from "#card/media.ts";
import { Overlay } from "#card/overlay.ts";
import { Root, type RootProps } from "#card/root.ts";
import { Section } from "#card/section.ts";
import { Title } from "#card/title.ts";

/**
 * Renders a tree inside a root with the recipe's default variants.
 *
 * @param children - The part under test.
 * @returns The root around the part.
 */
export function carded(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders all eleven parts under one root, nested the way a caller nests them.
 *
 * @param props - Props of the root, applied after its `aria-labelledby`.
 * @returns The composed card.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root aria-labelledby="card-title" {...props}>
      <Media>
        <img alt="" src="/invoice.png" />
        <Overlay>New</Overlay>
      </Media>
      <Header>
        <Indicator aria-hidden>#</Indicator>
        <Title id="card-title">Invoice 4821</Title>
        <Description>Issued on 2 September</Description>
        <Aside>
          <button type="button">More</button>
        </Aside>
      </Header>
      <Content>Three lines, one unbilled.</Content>
      <Section>Paid in full</Section>
      <Footer>
        <button type="button">Send</button>
      </Footer>
    </Root>
  );
}
