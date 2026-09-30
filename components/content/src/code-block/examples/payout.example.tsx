import { type ReactElement } from "react";

import * as CodeBlock from "#code-block/index.ts";

const BEFORE = `{
  "id": "po_1093",
  "amount": 324000,
  "currency": "GBP",
  "status": "queued",
  "destination": "Northwind Ltd",
  "arrival": "2026-10-02"
}`;

const AFTER = `{
  "id": "po_1093",
  "amount": 318500,
  "currency": "GBP",
  "status": "paid",
  "destination": "Northwind Ltd",
  "arrival": "2026-10-01"
}`;

export function Payout(): ReactElement {
  return (
    <CodeBlock.Root before={BEFORE} code={AFTER} language="json">
      <CodeBlock.Header>
        <CodeBlock.Title>po_1093.json</CodeBlock.Title>
        <CodeBlock.DiffStat />
      </CodeBlock.Header>
      <CodeBlock.Diff />
    </CodeBlock.Root>
  );
}
