import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as CodeBlock from "#code-block/index.ts";

function sgr(...codes: number[]): string {
  return `\u001B[${codes.join(";")}m`;
}

const RESET = sgr(0);

const OUTPUT = [
  `${sgr(2)}$ vp test --run${RESET}`,
  "",
  ` ${sgr(1, 36)}RUN${RESET}  ${sgr(36)}v5.0.1${RESET} ${sgr(90)}/work/payouts${RESET}`,
  "",
  ` ${sgr(32)}✓${RESET} src/payout.spec.ts ${sgr(90)}(12 tests)${RESET} ${sgr(2)}41ms${RESET}`,
  ` ${sgr(33)}❯${RESET} src/ledger.spec.ts ${sgr(90)}(8 tests | ${sgr(31)}1 failed${sgr(90)})${RESET} ${sgr(2)}63ms${RESET}`,
  `   ${sgr(31)}× ledger > rejects a transfer past the balance${RESET} ${sgr(2)}4ms${RESET}`,
  `     ${sgr(31)}→ expected 'settled' to be 'rejected' // Object.is equality${RESET}`,
  "",
  `${sgr(2)} Test Files ${RESET} ${sgr(1, 31)}1 failed${RESET}${sgr(90)} | ${RESET}${sgr(1, 32)}1 passed${RESET} ${sgr(90)}(2)${RESET}`,
  `${sgr(2)}      Tests ${RESET} ${sgr(1, 31)}1 failed${RESET}${sgr(90)} | ${RESET}${sgr(1, 32)}19 passed${RESET} ${sgr(90)}(20)${RESET}`,
  `${sgr(2)}   Duration ${RESET} 1.24s`,
].join("\n");

export function TestRun(props: Partial<CodeBlock.RootProps>): ReactElement {
  const { t } = useWords("code-block");

  return (
    <CodeBlock.Root code={OUTPUT} language="ansi" {...props}>
      <CodeBlock.Header>
        <CodeBlock.Title>test-run.log</CodeBlock.Title>
        <CodeBlock.Control>
          <CodeBlock.Copy
            copied={<CheckIcon aria-hidden size="1em" />}
            copiedLabel={t("terminal.copied")}
            label={t("terminal.copy")}
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
