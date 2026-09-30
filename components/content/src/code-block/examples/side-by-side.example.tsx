import { type ReactElement } from "react";

import * as CodeBlock from "#code-block/index.ts";

const BEFORE = `service: payouts
image: payouts:4.1.0
replicas: 2
resources:
  cpu: 500m
  memory: 512Mi
env:
  LOG_LEVEL: info
  LEDGER: ledger.internal`;

const AFTER = `service: payouts
image: payouts:4.2.0
replicas: 3
resources:
  cpu: 500m
  memory: 1Gi
env:
  LOG_LEVEL: info
  LEDGER: ledger.internal
  RETRIES: "5"
  BACKOFF: exponential`;

export function SideBySide(): ReactElement {
  return (
    <CodeBlock.Root before={BEFORE} code={AFTER} language="yaml">
      <CodeBlock.Header>
        <CodeBlock.Title>deploy/payouts.yaml</CodeBlock.Title>
        <CodeBlock.DiffStat />
      </CodeBlock.Header>
      <CodeBlock.Diff mode="split" />
    </CodeBlock.Root>
  );
}
