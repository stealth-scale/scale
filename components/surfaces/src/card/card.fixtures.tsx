/**
 * Assembles the wrappers a card part needs before a case can render it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Aside } from "#card/aside.ts";
import { Content } from "#card/content.ts";
import { Description } from "#card/description.ts";
import { Footer } from "#card/footer.ts";
import { Header } from "#card/header.ts";
import { Indicator } from "#card/indicator.ts";
import { Media } from "#card/media.ts";
import { Root, type RootProps } from "#card/root.ts";
import { Title } from "#card/title.ts";

/**
 * Renders a tree inside a root carrying the recipe's default variants.
 *
 * @param children - The part under test.
 * @returns The root, wrapping the part.
 */
export function carded(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders all nine parts under one root.
 *
 * @param props - Overrides for the root, applied over the label reference.
 * @returns The parts nested as a caller would nest them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root aria-labelledby="card-title" {...props}>
      <Media>
        <img alt="" src="/invoice.png" />
      </Media>
      <Header>
        <Indicator aria-hidden>●</Indicator>
        <Title id="card-title">Invoice 4821</Title>
        <Description>Issued on 2 September</Description>
        <Aside>
          <button type="button">More</button>
        </Aside>
      </Header>
      <Content>Three lines, one unbilled.</Content>
      <Footer>
        <button type="button">Send</button>
      </Footer>
    </Root>
  );
}
