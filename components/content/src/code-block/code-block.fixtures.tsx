/**
 * Builds the code block trees the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { Code } from "#code-block/code.tsx";
import { Content } from "#code-block/content.ts";
import { Control } from "#code-block/control.ts";
import { Header } from "#code-block/header.ts";
import { Root, type RootProps } from "#code-block/root.tsx";
import { Title } from "#code-block/title.ts";

/**
 * Source text every case renders: one TypeScript import statement.
 */
export const SOURCE = 'import { Button } from "@stealthscale/component-actions";';

/**
 * Renders the part under test inside a root with the fixture source in TypeScript.
 */
export function coded(children: ReactNode, props: Partial<RootProps> = {}): ReactElement {
  return (
    <Root code={SOURCE} language="tsx" {...props}>
      {children}
    </Root>
  );
}

/**
 * Renders every part, nested the way a caller nests them.
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
