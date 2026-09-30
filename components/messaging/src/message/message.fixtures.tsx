/**
 * Builds the turns the message specs render their subjects in.
 */

import { type ReactElement, type ReactNode } from "react";

import { Actions } from "#message/actions.ts";
import { Avatar } from "#message/avatar.ts";
import { Bubble } from "#message/bubble.tsx";
import { Content } from "#message/content.ts";
import { Footer } from "#message/footer.ts";
import { Header } from "#message/header.ts";
import { Root, type RootProps } from "#message/root.ts";
import { Status } from "#message/status.tsx";

/**
 * Renders a part inside the column of a turn whose root provides the variants.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root, which contains the column around the part.
 */
export function inTurn(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Content>{children}</Content>
    </Root>
  );
}

/**
 * Renders a turn of two messages with every part: an avatar, a header, a footer with a status and
 * an action.
 *
 * @param props - The root's props.
 * @returns The turn.
 */
export function turned(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Avatar>
        <span aria-hidden="true">AO</span>
      </Avatar>
      <Content>
        <Header>
          <strong>Ada Okafor</strong>
          <time dateTime="2026-09-30T09:12:00Z">09:12</time>
        </Header>
        <Bubble>The invoice is in.</Bubble>
        <Bubble>Can you approve it today?</Bubble>
        <Footer>
          <Status status="read">Read</Status>
          <Actions>
            <button type="button">Copy</button>
          </Actions>
        </Footer>
      </Content>
    </Root>
  );
}
