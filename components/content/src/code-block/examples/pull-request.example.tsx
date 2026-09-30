import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as CodeBlock from "#code-block/index.ts";

const BEFORE = `import { sleep } from "./sleep";

/**
 * Runs a task until it succeeds or the attempts run out.
 */
export async function retry<T>(task: () => Promise<T>, attempts = 3): Promise<T> {
  let failure: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      failure = error;
    }

    if (attempt < attempts) await sleep(100);
  }

  throw failure;
}

/**
 * Reports whether an error is worth another attempt.
 */
export function retryable(error: unknown): boolean {
  return error instanceof TypeError;
}`;

const AFTER = `import { isTimeout } from "./errors";
import { sleep } from "./sleep";

/**
 * Runs a task until it succeeds or the attempts run out.
 */
export async function retry<T>(task: () => Promise<T>, attempts = 5): Promise<T> {
  let failure: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      failure = error;
    }

    if (attempt < attempts) await sleep(100 * 2 ** attempt);
  }

  throw failure;
}

/**
 * Reports whether an error is worth another attempt.
 */
export function retryable(error: unknown): boolean {
  return error instanceof TypeError || isTimeout(error);
}`;

export function PullRequest(): ReactElement {
  const { t } = useWords("code-block");

  return (
    <CodeBlock.Root before={BEFORE} code={AFTER} language="ts">
      <CodeBlock.Header>
        <CodeBlock.Title>src/retry.ts</CodeBlock.Title>
        <CodeBlock.DiffStat />
      </CodeBlock.Header>
      <CodeBlock.Diff expandLabel={(count) => t("diff.expand", { count })} />
    </CodeBlock.Root>
  );
}
