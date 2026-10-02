import { type ReactElement } from "react";

import * as CodeBlock from "#code-block/index.ts";

const LOG = `12:04:31  payout 1093  queued     £3,240.00
12:04:33  payout 1093  submitted  Northwind Ltd
12:06:02  payout 1093  settled    2 transfers`;

export function Log(): ReactElement {
  return (
    <CodeBlock.Root code={LOG}>
      <CodeBlock.Header>
        <CodeBlock.Title>payouts.log</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}
