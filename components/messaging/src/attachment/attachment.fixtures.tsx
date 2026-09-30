/**
 * Builds the attachments the part specs render.
 */

import { type ReactElement } from "react";

import { Actions } from "#attachment/actions.ts";
import { Content } from "#attachment/content.ts";
import { Description } from "#attachment/description.ts";
import { Group, type GroupProps } from "#attachment/group.tsx";
import { Media } from "#attachment/media.ts";
import { Root, type RootProps } from "#attachment/root.tsx";
import { Title } from "#attachment/title.ts";

/**
 * Renders one attachment with every part.
 *
 * @param props - The props the case sets on the root.
 * @returns The attachment.
 */
export function filed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Media>
        <span aria-hidden="true">PDF</span>
      </Media>
      <Content>
        <Title>invoice-4471.pdf</Title>
        <Description>PDF, 248 kB</Description>
      </Content>
      <Actions>
        <button type="button">Remove invoice-4471.pdf</button>
      </Actions>
    </Root>
  );
}

/**
 * Renders a group of two attachments, named "Attachments".
 *
 * @param props - The props the case sets on the group.
 * @param first - The props the case sets on the first attachment.
 * @returns The group.
 */
export function grouped(props: GroupProps = {}, first: RootProps = {}): ReactElement {
  return (
    <Group aria-label="Attachments" {...props}>
      {filed(first)}
      <Root state="uploading">
        <Media>
          <span aria-hidden="true">CSV</span>
        </Media>
        <Content>
          <Title>payouts.csv</Title>
          <Description>Uploading, 42%</Description>
        </Content>
      </Root>
    </Group>
  );
}
