import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as CodeBlock from "#code-block/index.ts";

export function Policy(): ReactElement {
  const { t } = useWords("code-block");

  return (
    <CodeBlock.Root before={t("policy.before")} code={t("policy.after")} mode="inherit">
      <CodeBlock.Header>
        <CodeBlock.Title>refund-policy.txt</CodeBlock.Title>
        <CodeBlock.DiffStat
          statLabel={({ added, removed }) => t("diff.stat", { added, removed })}
        />
      </CodeBlock.Header>
      <CodeBlock.Diff
        addedLabel={t("diff.added")}
        context={Infinity}
        removedLabel={t("diff.removed")}
      />
    </CodeBlock.Root>
  );
}
