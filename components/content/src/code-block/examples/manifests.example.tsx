import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";

import * as CodeBlock from "#code-block/index.ts";

const PACKAGE = `{
  "name": "@stealthscale/component-content",
  "version": "0.1.0",
  "sideEffects": false
}`;

const INSTALL = `pnpm add @stealthscale/component-content
# register the preset under ./theme with the compiler
vp dev --port 5179`;

const WORKSPACE = `catalog:
  "@tanstack/highlight": 0.1.0
  "@zag-js/clipboard": 1.44.0`;

export function Manifests(): ReactElement {
  return (
    <Stack gap="md">
      <CodeBlock.Root code={PACKAGE} language="json">
        <CodeBlock.Header>
          <CodeBlock.Title>package.json</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code />
        </CodeBlock.Content>
      </CodeBlock.Root>
      <CodeBlock.Root code={INSTALL} language="shell">
        <CodeBlock.Header>
          <CodeBlock.Title>install.sh</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code />
        </CodeBlock.Content>
      </CodeBlock.Root>
      <CodeBlock.Root code={WORKSPACE} language="yaml">
        <CodeBlock.Header>
          <CodeBlock.Title>pnpm-workspace.yaml</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code />
        </CodeBlock.Content>
      </CodeBlock.Root>
    </Stack>
  );
}
