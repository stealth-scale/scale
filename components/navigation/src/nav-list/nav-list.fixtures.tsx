/**
 * Builds the navigation lists the part specs render their subjects in.
 */

import { type ReactElement, type ReactNode } from "react";

import { Action } from "#nav-list/action.ts";
import { Badge } from "#nav-list/badge.ts";
import { Branch, type BranchProps } from "#nav-list/branch.tsx";
import { Content } from "#nav-list/content.tsx";
import { Indicator } from "#nav-list/indicator.tsx";
import { Item } from "#nav-list/item.ts";
import { Link } from "#nav-list/link.ts";
import { Root, type RootProps } from "#nav-list/root.tsx";
import { Trigger } from "#nav-list/trigger.tsx";

/**
 * Renders a part inside a list that provides the variants.
 *
 * @param children - The part under test.
 * @param props - The list's props.
 * @returns The list, which contains the part.
 */
export function listed(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders a part inside a branch inside a list.
 *
 * @param children - The part under test.
 * @param props - The branch's props.
 * @returns The list, which contains the branch that contains the part.
 */
export function branched(children: ReactNode, props: BranchProps = {}): ReactElement {
  return (
    <Root>
      <Branch {...props}>{children}</Branch>
    </Root>
  );
}

/**
 * Renders a complete list: a current link with a count, a link with a control, and a branch with
 * one nested link.
 *
 * @param props - The list's props.
 * @returns The list.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Item>
        <Link aria-current="page" href="/">
          Overview
        </Link>
        <Badge>3</Badge>
      </Item>
      <Item>
        <Link href="/invoices">Invoices</Link>
        <Action aria-label="Pin Invoices">P</Action>
      </Item>
      <Branch>
        <Trigger>
          Settings
          <Indicator>v</Indicator>
        </Trigger>
        <Content>
          <Item>
            <Link href="/settings/team">Team</Link>
          </Item>
        </Content>
      </Branch>
    </Root>
  );
}
