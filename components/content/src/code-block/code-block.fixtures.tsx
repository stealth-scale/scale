/**
 * Builds the code block trees the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { Code } from "#code-block/code.tsx";
import { Content } from "#code-block/content.ts";
import { Control } from "#code-block/control.ts";
import { DiffStat } from "#code-block/diff-stat.tsx";
import { Diff, type DiffProps } from "#code-block/diff.tsx";
import { Header } from "#code-block/header.ts";
import { Root, type RootProps } from "#code-block/root.tsx";
import { Title } from "#code-block/title.ts";

/**
 * Source text every case renders: one TypeScript import statement.
 */
export const SOURCE = 'import { Button } from "@stealthscale/component-actions";';

/**
 * Earlier version of the retry helper every diff case compares: twelve lines.
 */
export const BEFORE = [
  'import { sleep } from "./sleep";',
  "",
  "export async function retry(task, attempts = 3) {",
  "  for (let attempt = 1; attempt <= attempts; attempt += 1) {",
  "    try {",
  "      return await task();",
  "    } catch (error) {",
  "      if (attempt === attempts) throw error;",
  "      await sleep(100);",
  "    }",
  "  }",
  "}",
].join("\n");

/**
 * Later version of the retry helper: five attempts and a backoff that doubles, two lines edited.
 */
export const AFTER = BEFORE.replace("attempts = 3", "attempts = 5").replace(
  "sleep(100)",
  "sleep(100 * 2 ** attempt)",
);

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
 * Renders the part under test inside a root that compares the two versions of the retry helper.
 */
export function diffed(children: ReactNode, props: Partial<RootProps> = {}): ReactElement {
  return (
    <Root before={BEFORE} code={AFTER} language="ts" {...props}>
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

/**
 * Renders a diff with a titled header and its counts, nested the way a caller nests them.
 */
export function reviewed(props: Partial<DiffProps> = {}): ReactElement {
  return diffed(
    <>
      <Header>
        <Title>retry.ts</Title>
        <DiffStat />
      </Header>
      <Diff {...props} />
    </>,
  );
}
