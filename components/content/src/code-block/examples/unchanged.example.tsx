import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as CodeBlock from "#code-block/index.ts";

const CONFIG = `{
  "extends": "@stealthscale/vite-config-typescript/web.json",
  "include": ["src"]
}`;

export function Unchanged(): ReactElement {
  const { t } = useWords("code-block");

  return (
    <CodeBlock.Root before={CONFIG} code={CONFIG} language="json">
      <CodeBlock.Header>
        <CodeBlock.Title>tsconfig.json</CodeBlock.Title>
        <CodeBlock.DiffStat />
      </CodeBlock.Header>
      <CodeBlock.Diff emptyLabel={t("diff.empty")} />
    </CodeBlock.Root>
  );
}
