/**
 * Builds the details the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { Content } from "#details/content.ts";
import { Indicator } from "#details/indicator.tsx";
import { Root, type RootProps } from "#details/root.ts";
import { Summary } from "#details/summary.ts";

/**
 * Renders a details with every part: a summary with an indicator, and content.
 *
 * @param props - The props of the root.
 * @returns The details.
 */
export function detailed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Summary>
        <Indicator>&gt;</Indicator>
        Refund policy
      </Summary>
      <Content>Refunds take 5 to 10 business days.</Content>
    </Root>
  );
}

/**
 * Renders the children inside a details with a summary.
 *
 * @param children - The part under test.
 * @returns The details around the part.
 */
export function inside(children: ReactNode): ReactElement {
  return (
    <Root open>
      <Summary>Refund policy</Summary>
      {children}
    </Root>
  );
}
