/**
 * Builds the navigation list a part's specification needs above it.
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
 * Draws whatever a case wants measured inside the list that hands down the variants.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the list.
 * @returns The list, holding it.
 */
export function listed(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Draws whatever a case wants measured inside a branch, inside the list.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the branch.
 * @returns The list, holding the branch, holding it.
 */
export function branched(children: ReactNode, props: BranchProps = {}): ReactElement {
  return (
    <Root>
      <Branch {...props}>{children}</Branch>
    </Root>
  );
}

/**
 * Draws a whole list, so a case can press a branch and read what its rows do.
 *
 * @param props - Whatever the case sets on the list.
 * @returns The parts composed the way a caller composes them.
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
        <Action>
          <button type="button">Pin Invoices</button>
        </Action>
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
