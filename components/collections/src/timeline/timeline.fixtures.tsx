/**
 * Builds the timelines the part specs render their subjects in.
 */

import { type ReactElement, type ReactNode } from "react";

import { Connector } from "#timeline/connector.ts";
import { Content } from "#timeline/content.ts";
import { Description } from "#timeline/description.ts";
import { Indicator } from "#timeline/indicator.ts";
import { Item } from "#timeline/item.ts";
import { Root, type RootProps } from "#timeline/root.ts";
import { Title } from "#timeline/title.ts";

/**
 * Renders a part inside an item of a timeline root that provides the variants.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root, which contains one item around the part.
 */
export function listed(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Item>{children}</Item>
    </Root>
  );
}

/**
 * Renders a timeline of two entries, the second with a date before the rail.
 *
 * @param props - The root's props.
 * @returns The timeline.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Item>
        <Connector>
          <Indicator>1</Indicator>
        </Connector>
        <Content>
          <Title>Offer raised</Title>
          <Description>Tuesday</Description>
        </Content>
      </Item>
      <Item>
        <Content>
          <Title>2 Mar</Title>
        </Content>
        <Connector>
          <Indicator>2</Indicator>
        </Connector>
        <Content>
          <Title>Settled</Title>
        </Content>
      </Item>
    </Root>
  );
}
