import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as CodeBlock from "#code-block/index.ts";

const SOURCE = `import { Button } from "@stealthscale/component-actions";

export function Send({ onSend }: SendProps) {
  const [sent, setSent] = useState(false);

  return (
    <Button disabled={sent} onClick={() => { onSend(); setSent(true); }}>
      {sent ? "Sent" : "Send the invoice"}
    </Button>
  );
}`;

export function Send(props: Partial<CodeBlock.RootProps>): ReactElement {
  const { t } = useWords("code-block");

  return (
    <CodeBlock.Root code={SOURCE} language="tsx" {...props}>
      <CodeBlock.Header>
        <CodeBlock.Title>send.tsx</CodeBlock.Title>
        <CodeBlock.Control>
          <CodeBlock.Copy
            copied={<CheckIcon aria-hidden size="1em" />}
            copiedLabel={t("copied")}
            label={t("copy")}
          >
            <CopyIcon aria-hidden size="1em" />
          </CodeBlock.Copy>
        </CodeBlock.Control>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}
