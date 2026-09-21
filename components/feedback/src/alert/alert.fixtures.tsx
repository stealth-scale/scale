/**
 * Mounts an alert for the specs of its slots, none of which resolve a variant without a root
 * above them.
 */

import { type ReactElement, type ReactNode } from "react";

import { Aside } from "#alert/aside.ts";
import { Content } from "#alert/content.ts";
import { Description } from "#alert/description.ts";
import { Indicator } from "#alert/indicator.ts";
import { Root, type RootProps } from "#alert/root.tsx";
import { Title } from "#alert/title.ts";

/**
 * Wraps one slot in a default root, giving it the variant context it resolves against.
 *
 * @param children - The slot under test.
 * @returns The root element containing it.
 */
export function alerted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders every slot of an alert at once, so that a case can assert across all of them.
 *
 * @param props - Forwarded to the root, usually the variants under test.
 * @returns An icon, a title, a description, and a dismiss control, composed as a caller composes
 *   them.
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
        <button type="button">Dismiss this warning</button>
      </Aside>
    </Root>
  );
}
