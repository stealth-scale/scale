/**
 * Builds the code block a part's specification needs above it, every part needing the root's
 * provider and the code it holds.
 */

import { type ReactElement, type ReactNode } from "react";

import { Code } from "#code-block/code.tsx";
import { Content } from "#code-block/content.ts";
import { Control } from "#code-block/control.ts";
import { Header } from "#code-block/header.ts";
import { Root, type RootProps } from "#code-block/root.tsx";
import { Title } from "#code-block/title.ts";

/**
 * The passage every case sets: one import in a component file.
 */
export const SOURCE = 'import { Button } from "@stealthscale/component-actions";';

/**
 * Draws whatever a case wants measured inside the panel that provides the variants and the code.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the panel.
 * @returns The panel, holding it.
 */
export function coded(children: ReactNode, props: Partial<RootProps> = {}): ReactElement {
  return (
    <Root code={SOURCE} language="tsx" {...props}>
      {children}
    </Root>
  );
}

/**
 * Draws a whole block, so a case can read how its parts are composed.
 *
 * @param props - Whatever the case sets on the panel.
 * @returns The six parts composed the way a caller composes them.
 */
export function composed(props: Partial<RootProps> = {}): ReactElement {
  return coded(
    <>
      <Header>
        <Title>button.tsx</Title>
        <Control>
          <button aria-label="Copy the code" type="button">
            ⧉
          </button>
        </Control>
      </Header>
      <Content>
        <Code />
      </Content>
    </>,
    props,
  );
}
