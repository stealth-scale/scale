/**
 * Supplies the root every part has to be rendered inside, since each one reads the recipe variants
 * and the code from it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Code } from "#code-block/code.tsx";
import { Content } from "#code-block/content.ts";
import { Control } from "#code-block/control.ts";
import { Header } from "#code-block/header.ts";
import { Root, type RootProps } from "#code-block/root.tsx";
import { Title } from "#code-block/title.ts";

/**
 * The source text every case renders, a single import statement.
 */
export const SOURCE = 'import { Button } from "@stealthscale/component-actions";';

/**
 * Wraps the part under test in a root carrying the fixture source in TypeScript.
 */
export function coded(children: ReactNode, props: Partial<RootProps> = {}): ReactElement {
  return (
    <Root code={SOURCE} language="tsx" {...props}>
      {children}
    </Root>
  );
}

/**
 * Renders every slot of the block arranged the way a caller arranges them.
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
