import { type ReactElement } from "react";

import * as CodeBlock from "#code-block/index.ts";

const BEFORE = `export function feeOf(amount: number): number {
  if (amount < 1000) return 30;
  if (amount < 10000) return Math.round(amount * 0.029);
  return Math.round(amount * 0.025);
}`;

const AFTER = `export function feeOf(amount: number): number {
  const rate = RATES.find((tier) => amount < tier.below) ?? LAST_RATE;
  return Math.max(MINIMUM_FEE, Math.round(amount * rate.share));
}`;

export function Rewrite(): ReactElement {
  return (
    <CodeBlock.Root before={BEFORE} code={AFTER} language="ts">
      <CodeBlock.Header>
        <CodeBlock.Title>src/fees.ts</CodeBlock.Title>
        <CodeBlock.DiffStat />
      </CodeBlock.Header>
      <CodeBlock.Diff />
    </CodeBlock.Root>
  );
}
