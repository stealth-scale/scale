/**
 * Test fixtures for the alert parts, which read the variants from the root.
 */

import { type ReactElement, type ReactNode } from "react";

import { Aside } from "#alert/aside.ts";
import { CloseTrigger } from "#alert/close-trigger.tsx";
import { Content } from "#alert/content.ts";
import { Description } from "#alert/description.ts";
import { Indicator } from "#alert/indicator.ts";
import { Root, type RootProps } from "#alert/root.tsx";
import { Title } from "#alert/title.ts";

/**
 * Renders the part under test inside `Alert.Root`.
 */
export function alerted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders every part, with the props passed to the root.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Indicator>!</Indicator>
      <Content>
        <Title>Payment failed</Title>
        <Description>The card was declined.</Description>
      </Content>
      <Aside>
        <button type="button">Retry the payment</button>
      </Aside>
      <CloseTrigger label="Dismiss this warning">x</CloseTrigger>
    </Root>
  );
}
