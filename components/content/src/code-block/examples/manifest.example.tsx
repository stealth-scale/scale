import { type ReactElement } from "react";

import * as CodeBlock from "#code-block/index.ts";

const PACKAGE = `{
  "name": "@stealthscale/component-content",
  "version": "0.1.0",
  "sideEffects": false
}`;

export function Manifest(props: Partial<CodeBlock.RootProps>): ReactElement {
  return (
    <CodeBlock.Root code={PACKAGE} language="json" {...props}>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}
